import status from "http-status";
import AppError from "../../errorHelper/AppError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { Role } from "../../../../generated/prisma/enums";

const getDashboardStatsData = async (user : IRequestUser) => {
    // Check if user exists (based on userId)
    const userExists = await prisma.user.findUnique({
        where: { email:user.email }
    });

    if (!userExists) {
        throw new AppError(status.NOT_FOUND, "User does not exist");
    }
    let statsData;
    switch(user.role){
        case Role.Admin:
            statsData = getAdminDashboardStats();
            break;
        case Role.Provider:
            statsData = getProviderDashboardStats(userExists.id);
            break;
        default:
            throw new AppError(status.BAD_REQUEST, "Invalid user role");
    }

    return statsData;
}
interface IBarChartData {
  month: string;
  revenue: number;
}

export const getAdminDashboardStats = async () => {
  try {
    const counts = await prisma.$transaction([
      prisma.meal.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.review.count(),
      // prisma.payment.count(),
    ]);

    const [mealsCount, userCount, orderCount, reviewCount,] = counts;
    // 🔹 Event Status Counts
    const [approvedmeals, pendingmeals,rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: { status: "APPROVED" } }),
      prisma.meal.count({ where: { status: "PENDING"} }),
      prisma.meal.count({ where: { status: "REJECTED" } }),
    ]);
    const [cancelledorder,deliveredorder,placedorder,preparingorder,readyorder] = await Promise.all([
      prisma.order.count({ where: { status:"CANCELLED" } }),
      prisma.order.count({ where: { status:"DELIVERED" } }),
      prisma.order.count({ where: { status:"PLACED"} }),
      prisma.order.count({ where: { status:"PREPARING" } }),
      prisma.order.count({ where: { status:"READY" } }),
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyRevenue: Record<number, number> = {};

    const barChartData: IBarChartData[] = monthNames.map((month, idx) => ({
      month,
      revenue: monthlyRevenue[idx] ?? 0,
    }));
    return {
      counts: {
        mealsCount:mealsCount,
        orderCount,
        reviewCount,
        userCount,
      },
     order:{
      cancelledorder,
      deliveredorder,
      placedorder,
      preparingorder,
      readyorder,
     },
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      // pieChartData,
    };
  } catch (error) {
    console.error("Failed to fetch admin dashboard stats:", error);
    throw new Error("Could not fetch dashboard stats");
  }
};


interface IBarChartData {
  month: string;
  revenue: number;
}

export const getProviderDashboardStats = async (userId: string) => {
  try {
    // 🔹 Counts related to user
    const counts = await prisma.$transaction([
      prisma.meal.count({
        where:{
          provider:{
            userId:userId
          }
        }
      }),
      prisma.order.count({
        where:{
          provider:{
            userId:userId
          }
        }
      }),

    ]);
    const [mealsCount, orderCount] = counts;


    const [approvedmeals, pendingmeals,rejectedmeals] = await Promise.all([
      prisma.meal.count({ where: {provider:{
        userId:userId
      }, status: "APPROVED" } }),
      prisma.meal.count({ where: {provider:{
        userId:userId
      }, status: "PENDING"} }),
      prisma.meal.count({ where: {provider:{
        userId:userId
      }, status: "REJECTED" } }),
    ]);

    const [cancelledorder,deliveredorder,placedorder,preparingorder,readyorder] = await Promise.all([
      prisma.order.count({ where: {provider:{
        userId:userId
      }, status:"CANCELLED" } }),
      prisma.order.count({ where: {provider:{
        userId:userId
      }, status:"DELIVERED" } }),
      prisma.order.count({ where: {provider:{
        userId:userId
      }, status:"PLACED"} }),
      prisma.order.count({ where: { provider:{
        userId:userId
      },status:"PREPARING" } }),
      prisma.order.count({ where: {provider:{
        userId:userId
      }, status:"READY" } }),
    ]);
    return {
      counts: {
        mealsCount:mealsCount,
        orderCount,
      },
      mealStatus: {
        approvedmeals,
        pendingmeals,
        rejectedmeals
      },
      order:{
        cancelledorder,
        deliveredorder,
        placedorder,
        preparingorder,
        readyorder,
       }
    };
  } catch (error) {
    console.error("Failed to fetch user dashboard stats:", error);
    throw new Error("Could not fetch user dashboard stats");
  }
};

export const statsService={ getDashboardStatsData}