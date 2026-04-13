import z from "zod";
import { Order, Orderitem } from "../../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { formatZodIssues } from "../../utils/handleZodError";
import { CreateorderData } from "./order.validation";
import AppError from "../../errorHelper/AppError";
import status from "http-status";
import { ICreateorderData } from "./order.interface";
import { OrderWhereInput } from "../../../../generated/prisma/models";
import { parseDateForPrisma } from "../../utils/parseDate";

const CreateOrder = async (payload: ICreateorderData, customerId: string) => {
  const mealId = payload.items.find((i) => i.mealId);
  const existingmeals = await prisma.meal.findMany({
    where: {
      id: mealId?.mealId,
    },
  });
  
  const mealdata = existingmeals.find((meal) => meal.id == mealId?.mealId);
  const orderexisting = await prisma.order.findMany({
    where: {
      customerId,
      orderitem: {
        some: {
          mealId: mealId?.mealId,
        },
      },
    },
  });
  const existingOrder = orderexisting.filter((item, index) =>item.status=='PLACED');
  if (existingOrder.length > 0) {

    throw new AppError(
      409,
      `There is already a placed order for the meal with id (${mealId?.mealId}). Please wait for the previous order to be completed, or remove the id and name.`
 
    );
  }
  try {
    const result = await prisma.order.create({
      data: {
        customerId: customerId,
        providerId: mealdata!.providerId,
        address: payload.address,
        phone: payload.phone,
        first_name: payload.first_name,
        last_name: payload.last_name,
        orderitem: {
          createMany: {
            data: payload.items.map((item) => ({
              mealId: item.mealId,
              price: mealdata!.price,
              quantity: item.quantity,
            })),
          },
        },
        totalPrice:
          mealdata!.price! *
            payload.items.reduce((acc, item) => acc + item.quantity, 0) || 0,
      },
      include: {
        orderitem: {
          include: {
            meal: {
              select: {
                meals_name: true,
                cuisine: true,
                price: true,
              },
            },
          },
        },
        provider: true,
      },
    });
    if (result.orderitem.length==0) {
        await prisma.order.delete({
            where:{
                id:result.id
            }
        })
        throw new AppError(400,'order created failed')
    }
    return result;
  } catch (error) {
    throw new AppError(500,'something went wrong,please try again')
  }
};

const getOwnmealsOrder = async (
  email?:string,
  data?: Record<string, any>,
  page?: number,
  limit?: number | undefined,
  skip?: number,
  sortBy?: string | undefined,
  sortOrder?: string | undefined,
  search?:string | undefined
) => {


  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  });
  if (!existingUser) {
    return {
      success: false,
      message: "User not found",
      result: null,
    };
  }

  const andConditions: OrderWhereInput[]  = [];

  if (search) {
    const orConditions: any[] = [];
    orConditions.push(
      {
        first_name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        last_name: {
          contains: search,
          mode: "insensitive",
        },
      },
    );
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }

  if (data?.status) {
    andConditions.push({
      status: {
        equals: data.status,
      },
    });
  }
  if (data?.totalPrice) {
    andConditions.push({
      totalPrice: {
        gte: 0,
        lte: Number(data.price),
      },
    });
  }

  if (data?.createdAt) {
    const dateRange = parseDateForPrisma(data.createdAt);
    andConditions.push({ createdAt: dateRange.gte });
  }
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: existingUser.id,
        AND:andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result,
    };
  }

  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      take: limit,
      skip,
      where: {
        providerId: existingUser.provider?.id,
        AND:andConditions
      },
      include: {
        orderitem: {
          include: {
            meal: true,
          },
        },
      },
    });
    let total = 0;
    if (existingUser?.role === "Provider") {
      total = await prisma.order.count({
        where: {
          providerId: existingUser.provider?.id,
          AND: andConditions,
        },
      });
    } else if (existingUser?.role === "Customer") {
      total = await prisma.order.count({
        where: {
          customerId: existingUser.id,
          AND: andConditions,
        },
      });
    }
    return {
      result,
      pagination: {
        total,
        page,
        limit,
        totalpage: Math.ceil(total / (limit || 1)),
      },
    };
  }
};

const UpdateOrderStatus = async (
  id: string,
  data: Partial<Order>,
  role: string,
) => {
  const { status } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ];
  if (!statusValue.includes(status as string)) {
    throw new AppError(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError(404, "no order found for this id");
  }

  if (existingOrder?.status == status) {
    throw new AppError(409, `order already ${status}`);
  }
  if (role == "Customer" && status !== "CANCELLED") {
    throw new AppError(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status == "CANCELLED") {
    if (
      existingOrder?.status == "DELIVERED" ||
      existingOrder?.status == "PREPARING" ||
      existingOrder?.status == "READY"
    ) {
      throw new AppError(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`,
      );
    }
    const result = await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
    return result;
  }

  if (role == "Provider" && status === "CANCELLED") {
    return "CANCELLED only Customer Change";
  }

  if (role == "Provider") {
    if (
      status == "PLACED" ||
      status == "PREPARING" ||
      status == "READY" ||
      status == "DELIVERED"
    ) {
      const result = await prisma.order.update({
        where: {
          id,
        },
        data: {
          status,
        },
      });
      return {
        success: true,
        message: `update order status successfully`,
        result,
      };
    }
  }
};

const getAllorder = async (role: string) => {
  if (role !== "Admin") {
    return "view all order only Admin";
  }
  const result = await prisma.order.findMany({
    include: {
      orderitem: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};

const customerOrderStatusTrack = async (mealid: string, userid: string) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid,
        },
      },
    },
  });
  if (existingOrder.length === 0) {
    throw new AppError(status.NOT_FOUND, "no order found for this meal");
  }
  console.log(existingOrder, "data");

  // const result = await prisma.order.findMany({
  //     include: {
  //         orderitem: {
  //             where: {
  //                 mealId: mealid
  //             },
  //             select: {
  //                 mealId: true,
  //                 price: true,
  //                 quantity: true
  //             },
  //             orderBy: {
  //                 createdAt: 'desc'
  //             }
  //         },

  //     },
  //     orderBy: {
  //         createdAt: 'desc'
  //     }
  // })
  // console.log(result,'dd')
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder,
  };
};

const CustomerRunningAndOldOrder = async (userid: string, status: string) => {
  const andConditions: any[] = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status;
  if (status == "DELIVERED") {
    andConditions.push({ status: status });
    ((message = "Recent order information retrieved successfully."),
      (currentStatus = status));
  }
  if (status == "CANCELLED") {
    andConditions.push({ status: status });
    ((message = "CANCELLED order information retrieved successfully."),
      (currentStatus = status));
  }

  if (status == "PLACED" || status == "PREPARING" || status == "READY") {
    andConditions.push({ status: status });
    ((message = "running order retrieved successfully."),
      (currentStatus = status));
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions,
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } },
    },
  });

  return {
    success: true,
    message,
    result,
  };
};

const getSingleOrder = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!result) {
    throw new AppError(status.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result,
  };
};

export const ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder,
};
