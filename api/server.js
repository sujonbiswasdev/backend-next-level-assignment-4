var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.5.0",
  "engineVersion": "280c870be64f457428992c43c1f6d557fab6e29e",
  "activeProvider": "postgresql",
  "inlineSchema": 'model User {\n  id            String           @id\n  name          String\n  email         String           @unique\n  emailVerified Boolean          @default(false)\n  image         String?\n  bgimage       String?\n  phone         String           @db.VarChar(15)\n  role          Role             @default(Customer)\n  status        Status           @default(activate)\n  isActive      Boolean          @default(true)\n  createdAt     DateTime         @default(now())\n  updatedAt     DateTime         @updatedAt\n  accounts      Account[]\n  category      Category[]\n  orders        Order[]\n  provider      ProviderProfile?\n  reviews       Review[]\n  sessions      Session[]\n\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum Role {\n  Customer\n  Provider\n  Admin\n}\n\nenum Status {\n  activate\n  suspend\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  adminId   String\n  name      String   @unique @db.VarChar(150)\n  image     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  user      User     @relation(fields: [adminId], references: [id], onDelete: Cascade)\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id                String            @id @default(uuid())\n  meals_name        String            @db.VarChar(100)\n  description       String?\n  image             String?\n  price             Int\n  isAvailable       Boolean           @default(true)\n  dietaryPreference DietaryPreference @default(HALAL)\n  providerId        String\n  category_name     String\n  cuisine           Cuisine           @default(BANGLEDESHI)\n  status            MealsStatus       @default(APPROVED)\n  createdAt         DateTime          @default(now())\n  updatedAt         DateTime          @updatedAt\n  category          Category          @relation(fields: [category_name], references: [name], onDelete: Cascade)\n  provider          ProviderProfile   @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem         Orderitem[]\n  reviews           Review[]\n\n  @@map("meal")\n}\n\nenum DietaryPreference {\n  HALAL\n  VEGAN\n  VEGETARIAN\n  ANY\n  GLUTEN_FREE\n  KETO\n  PALEO\n  DAIRY_FREE\n  NUT_FREE\n  LOW_SUGAR\n}\n\nenum Cuisine {\n  BANGLEDESHI\n  ITALIAN\n  CHINESE\n  INDIAN\n  MEXICAN\n  THAI\n  JAPANESE\n  FRENCH\n  MEDITERRANEAN\n  AMERICAN\n  MIDDLE_EASTERN\n}\n\nenum MealsStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nmodel Order {\n  id         String          @id @default(uuid())\n  customerId String\n  providerId String\n  first_name String?\n  last_name  String?\n  status     OrderStatus     @default(PLACED)\n  totalPrice Int\n  phone      String?\n  address    String\n  createdAt  DateTime        @default(now())\n  updatedAt  DateTime        @updatedAt\n  customer   User            @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  provider   ProviderProfile @relation(fields: [providerId], references: [id], onDelete: Cascade)\n  orderitem  Orderitem[]\n\n  @@map("order")\n}\n\nmodel Orderitem {\n  id        String   @id @default(uuid())\n  orderId   String\n  price     Float\n  quantity  Int\n  mealId    String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  order     Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)\n\n  @@map("orderitem")\n}\n\nenum OrderStatus {\n  PLACED\n  PREPARING\n  READY\n  DELIVERED\n  CANCELLED\n}\n\nmodel ProviderProfile {\n  id             String   @id @default(uuid())\n  userId         String   @unique\n  restaurantName String   @db.VarChar(100)\n  address        String   @db.VarChar(200)\n  description    String?\n  image          String?  @db.VarChar(100)\n  createdAt      DateTime @default(now())\n  updatedAt      DateTime @updatedAt\n  meals          Meal[]\n  orders         Order[]\n  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("providerprofile")\n}\n\nmodel Review {\n  id         String       @id @default(uuid())\n  customerId String\n  mealId     String\n  parentId   String?\n  rating     Int\n  status     ReviewStatus @default(APPROVED)\n  comment    String\n  createdAt  DateTime     @default(now())\n  updatedAt  DateTime     @updatedAt\n  customer   User         @relation(fields: [customerId], references: [id], onDelete: Cascade)\n  meal       Meal         @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  parent     Review?      @relation("reviewsReply", fields: [parentId], references: [id], onDelete: Cascade)\n  replies    Review[]     @relation("reviewsReply")\n\n  @@map("review")\n}\n\nenum ReviewStatus {\n  APPROVED\n  REJECTED\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"bgimage","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"ProviderProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"adminId","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CategoryToUser"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"meals_name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"dietaryPreference","kind":"enum","type":"DietaryPreference"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"category_name","kind":"scalar","type":"String"},{"name":"cuisine","kind":"enum","type":"Cuisine"},{"name":"status","kind":"enum","type":"MealsStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"MealToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"MealToOrderitem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meal"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"first_name","kind":"scalar","type":"String"},{"name":"last_name","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"provider","kind":"object","type":"ProviderProfile","relationName":"OrderToProviderProfile"},{"name":"orderitem","kind":"object","type":"Orderitem","relationName":"OrderToOrderitem"}],"dbName":"order"},"Orderitem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderitem"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderitem"}],"dbName":"orderitem"},"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"restaurantName","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"MealToProviderProfile"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToProviderProfile"},{"name":"user","kind":"object","type":"User","relationName":"ProviderProfileToUser"}],"dbName":"providerprofile"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"customerId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"customer","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"parent","kind":"object","type":"Review","relationName":"reviewsReply"},{"name":"replies","kind":"object","type":"Review","relationName":"reviewsReply"}],"dbName":"review"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","accounts","category","meals","customer","provider","meal","order","orderitem","_count","orders","parent","replies","reviews","sessions","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Meal.findUnique","Meal.findUniqueOrThrow","Meal.findFirst","Meal.findFirstOrThrow","Meal.findMany","Meal.createOne","Meal.createMany","Meal.createManyAndReturn","Meal.updateOne","Meal.updateMany","Meal.updateManyAndReturn","Meal.upsertOne","Meal.deleteOne","Meal.deleteMany","_avg","_sum","Meal.groupBy","Meal.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Orderitem.findUnique","Orderitem.findUniqueOrThrow","Orderitem.findFirst","Orderitem.findFirstOrThrow","Orderitem.findMany","Orderitem.createOne","Orderitem.createMany","Orderitem.createManyAndReturn","Orderitem.updateOne","Orderitem.updateMany","Orderitem.updateManyAndReturn","Orderitem.upsertOne","Orderitem.deleteOne","Orderitem.deleteMany","Orderitem.groupBy","Orderitem.aggregate","ProviderProfile.findUnique","ProviderProfile.findUniqueOrThrow","ProviderProfile.findFirst","ProviderProfile.findFirstOrThrow","ProviderProfile.findMany","ProviderProfile.createOne","ProviderProfile.createMany","ProviderProfile.createManyAndReturn","ProviderProfile.updateOne","ProviderProfile.updateMany","ProviderProfile.updateManyAndReturn","ProviderProfile.upsertOne","ProviderProfile.deleteOne","ProviderProfile.deleteMany","ProviderProfile.groupBy","ProviderProfile.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","customerId","mealId","parentId","rating","ReviewStatus","status","comment","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","restaurantName","address","description","image","every","some","none","orderId","price","quantity","providerId","first_name","last_name","OrderStatus","totalPrice","phone","meals_name","isAvailable","DietaryPreference","dietaryPreference","category_name","Cuisine","cuisine","MealsStatus","adminId","name","identifier","value","expiresAt","accountId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","bgimage","Role","role","Status","isActive","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "ugVfoAEVBAAA2AIAIAUAANkCACAIAADaAgAgDQAArwIAIBAAANsCACARAADcAgAgugEAANQCADC7AQAANAAQvAEAANQCADC9AQEAAAABwwEAANcCgQIixQFAAK0CACHGAUAArQIAIdYBAQCsAgAh4gEBAKsCACHsAQEAqwIAIfsBAQAAAAH8ASAA1QIAIf0BAQCsAgAh_wEAANYC_wEigQIgANUCACEBAAAAAQAgEQMAALACACC6AQAA8AIAMLsBAAADABC8AQAA8AIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhCAMAAOYDACDxAQAA8gIAIPIBAADyAgAg8wEAAPICACD0AQAA8gIAIPUBAADyAgAg9gEAAPICACD3AQAA8gIAIBEDAACwAgAgugEAAPACADC7AQAAAwAQvAEAAPACADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhAwAAAAMAIAEAAAQAMAIAAAUAIAsDAACwAgAgBgAArgIAILoBAADvAgAwuwEAAAcAELwBAADvAgAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh1gEBAKsCACHrAQEAqwIAIewBAQCrAgAhAgMAAOYDACAGAADkAwAgCwMAALACACAGAACuAgAgugEAAO8CADC7AQAABwAQvAEAAO8CADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdYBAQCrAgAh6wEBAKsCACHsAQEAAAABAwAAAAcAIAEAAAgAMAIAAAkAIBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAqwIAIcMBAADtAusBIsUBQACtAgAhxgFAAK0CACHVAQEArAIAIdYBAQCsAgAh2wECAN8CACHdAQEAqwIAIeMBAQCrAgAh5AEgANUCACHmAQAA6wLmASLnAQEAqwIAIekBAADsAukBIgYFAADtBAAgCAAA5gQAIAsAAOwEACAQAADnBAAg1QEAAPICACDWAQAA8gIAIBQFAADuAgAgCAAA6AIAIAsAAOkCACAQAADbAgAgugEAAOoCADC7AQAACwAQvAEAAOoCADC9AQEAAAABwwEAAO0C6wEixQFAAK0CACHGAUAArQIAIdUBAQCsAgAh1gEBAKwCACHbAQIA3wIAId0BAQCrAgAh4wEBAKsCACHkASAA1QIAIeYBAADrAuYBIucBAQCrAgAh6QEAAOwC6QEiAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACARBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAqwIAIb4BAQCrAgAhwwEAAOcC4QEixQFAAK0CACHGAUAArQIAIdQBAQCrAgAh3QEBAKsCACHeAQEArAIAId8BAQCsAgAh4QECAN8CACHiAQEArAIAIQYHAADmAwAgCAAA5gQAIAsAAOwEACDeAQAA8gIAIN8BAADyAgAg4gEAAPICACARBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAAAABvgEBAKsCACHDAQAA5wLhASLFAUAArQIAIcYBQACtAgAh1AEBAKsCACHdAQEAqwIAId4BAQCsAgAh3wEBAKwCACHhAQIA3wIAIeIBAQCsAgAhAwAAABAAIAEAABEAMAIAABIAIAwJAADhAgAgCgAA5QIAILoBAADjAgAwuwEAABQAELwBAADjAgAwvQEBAKsCACG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACECCQAA6QQAIAoAAOsEACAMCQAA4QIAIAoAAOUCACC6AQAA4wIAMLsBAAAUABC8AQAA4wIAML0BAQAAAAG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACEDAAAAFAAgAQAAFQAwAgAAFgAgAQAAABQAIAEAAAALACABAAAAEAAgAwAAABQAIAEAABUAMAIAABYAIBAHAACwAgAgCQAA4QIAIA4AAOICACAPAADbAgAgugEAAN4CADC7AQAAHAAQvAEAAN4CADC9AQEAqwIAIb4BAQCrAgAhvwEBAKsCACHAAQEArAIAIcEBAgDfAgAhwwEAAOACwwEixAEBAKsCACHFAUAArQIAIcYBQACtAgAhBQcAAOYDACAJAADpBAAgDgAA6gQAIA8AAOcEACDAAQAA8gIAIBAHAACwAgAgCQAA4QIAIA4AAOICACAPAADbAgAgugEAAN4CADC7AQAAHAAQvAEAAN4CADC9AQEAAAABvgEBAKsCACG_AQEAqwIAIcABAQCsAgAhwQECAN8CACHDAQAA4ALDASLEAQEAqwIAIcUBQACtAgAhxgFAAK0CACEDAAAAHAAgAQAAHQAwAgAAHgAgAQAAABwAIAMAAAAcACABAAAdADACAAAeACABAAAAHAAgAQAAABQAIAEAAAAcACABAAAACwAgAwAAABAAIAEAABEAMAIAABIAIA4DAACwAgAgBgAArgIAIA0AAK8CACC6AQAAqgIAMLsBAAAnABC8AQAAqgIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh0wEBAKsCACHUAQEAqwIAIdUBAQCsAgAh1gEBAKwCACEBAAAAJwAgAwAAABwAIAEAAB0AMAIAAB4AIAwDAACwAgAgugEAAN0CADC7AQAAKgAQvAEAAN0CADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAKsCACH5AQEArAIAIfoBAQCsAgAhAwMAAOYDACD5AQAA8gIAIPoBAADyAgAgDAMAALACACC6AQAA3QIAMLsBAAAqABC8AQAA3QIAML0BAQAAAAHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHvAUAArQIAIfgBAQAAAAH5AQEArAIAIfoBAQCsAgAhAwAAACoAIAEAACsAMAIAACwAIAEAAAADACABAAAABwAgAQAAABAAIAEAAAAcACABAAAAKgAgAQAAAAEAIBUEAADYAgAgBQAA2QIAIAgAANoCACANAACvAgAgEAAA2wIAIBEAANwCACC6AQAA1AIAMLsBAAA0ABC8AQAA1AIAML0BAQCrAgAhwwEAANcCgQIixQFAAK0CACHGAUAArQIAIdYBAQCsAgAh4gEBAKsCACHsAQEAqwIAIfsBAQCrAgAh_AEgANUCACH9AQEArAIAIf8BAADWAv8BIoECIADVAgAhCAQAAOQEACAFAADlBAAgCAAA5gQAIA0AAOUDACAQAADnBAAgEQAA6AQAINYBAADyAgAg_QEAAPICACADAAAANAAgAQAANQAwAgAAAQAgAwAAADQAIAEAADUAMAIAAAEAIAMAAAA0ACABAAA1ADACAAABACASBAAA3gQAIAUAAN8EACAIAADhBAAgDQAA4AQAIBAAAOIEACARAADjBAAgvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAEBFwAAOQAgDL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABARcAADsAMAEXAAA7ADASBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBAAAKEEACARAACiBAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACECAAAAAQAgFwAAPgAgDL0BAQD4AgAhwwEAAJwEgQIixQFAAPsCACHGAUAA-wIAIdYBAQD8AgAh4gEBAPgCACHsAQEA-AIAIfsBAQD4AgAh_AEgAMEDACH9AQEA_AIAIf8BAACbBP8BIoECIADBAwAhAgAAADQAIBcAAEAAIAIAAAA0ACAXAABAACADAAAAAQAgHgAAOQAgHwAAPgAgAQAAAAEAIAEAAAA0ACAFDAAAmAQAICQAAJoEACAlAACZBAAg1gEAAPICACD9AQAA8gIAIA-6AQAAzQIAMLsBAABHABC8AQAAzQIAML0BAQCYAgAhwwEAAM8CgQIixQFAAJwCACHGAUAAnAIAIdYBAQCZAgAh4gEBAJgCACHsAQEAmAIAIfsBAQCYAgAh_AEgALkCACH9AQEAmQIAIf8BAADOAv8BIoECIAC5AgAhAwAAADQAIAEAAEYAMCMAAEcAIAMAAAA0ACABAAA1ADACAAABACABAAAALAAgAQAAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgAwAAACoAIAEAACsAMAIAACwAIAkDAACXBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB0gEBAAAAAe8BQAAAAAH4AQEAAAAB-QEBAAAAAfoBAQAAAAEBFwAATwAgCL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHvAUAAAAAB-AEBAAAAAfkBAQAAAAH6AQEAAAABARcAAFEAMAEXAABRADAJAwAAlgQAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACECAAAALAAgFwAAVAAgCL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACECAAAAKgAgFwAAVgAgAgAAACoAIBcAAFYAIAMAAAAsACAeAABPACAfAABUACABAAAALAAgAQAAACoAIAUMAACTBAAgJAAAlQQAICUAAJQEACD5AQAA8gIAIPoBAADyAgAgC7oBAADMAgAwuwEAAF0AELwBAADMAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh0gEBAJgCACHvAUAAnAIAIfgBAQCYAgAh-QEBAJkCACH6AQEAmQIAIQMAAAAqACABAABcADAjAABdACADAAAAKgAgAQAAKwAwAgAALAAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAOAwAAkgQAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHdAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBQAAAAAH1AUAAAAAB9gEBAAAAAfcBAQAAAAEBFwAAZQAgDb0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHdAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBQAAAAAH1AUAAAAAB9gEBAAAAAfcBAQAAAAEBFwAAZwAwARcAAGcAMA4DAACRBAAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh0gEBAPgCACHdAQEA-AIAIfABAQD4AgAh8QEBAPwCACHyAQEA_AIAIfMBAQD8AgAh9AFAAJAEACH1AUAAkAQAIfYBAQD8AgAh9wEBAPwCACECAAAABQAgFwAAagAgDb0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh3QEBAPgCACHwAQEA-AIAIfEBAQD8AgAh8gEBAPwCACHzAQEA_AIAIfQBQACQBAAh9QFAAJAEACH2AQEA_AIAIfcBAQD8AgAhAgAAAAMAIBcAAGwAIAIAAAADACAXAABsACADAAAABQAgHgAAZQAgHwAAagAgAQAAAAUAIAEAAAADACAKDAAAjQQAICQAAI8EACAlAACOBAAg8QEAAPICACDyAQAA8gIAIPMBAADyAgAg9AEAAPICACD1AQAA8gIAIPYBAADyAgAg9wEAAPICACAQugEAAMgCADC7AQAAcwAQvAEAAMgCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHSAQEAmAIAId0BAQCYAgAh8AEBAJgCACHxAQEAmQIAIfIBAQCZAgAh8wEBAJkCACH0AUAAyQIAIfUBQADJAgAh9gEBAJkCACH3AQEAmQIAIQMAAAADACABAAByADAjAABzACADAAAAAwAgAQAABAAwAgAABQAgCboBAADHAgAwuwEAAHkAELwBAADHAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHtAQEAqwIAIe4BAQCrAgAh7wFAAK0CACEBAAAAdgAgAQAAAHYAIAm6AQAAxwIAMLsBAAB5ABC8AQAAxwIAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIe0BAQCrAgAh7gEBAKsCACHvAUAArQIAIQADAAAAeQAgAQAAegAwAgAAdgAgAwAAAHkAIAEAAHoAMAIAAHYAIAMAAAB5ACABAAB6ADACAAB2ACAGvQEBAAAAAcUBQAAAAAHGAUAAAAAB7QEBAAAAAe4BAQAAAAHvAUAAAAABARcAAH4AIAa9AQEAAAABxQFAAAAAAcYBQAAAAAHtAQEAAAAB7gEBAAAAAe8BQAAAAAEBFwAAgAEAMAEXAACAAQAwBr0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIe0BAQD4AgAh7gEBAPgCACHvAUAA-wIAIQIAAAB2ACAXAACDAQAgBr0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIe0BAQD4AgAh7gEBAPgCACHvAUAA-wIAIQIAAAB5ACAXAACFAQAgAgAAAHkAIBcAAIUBACADAAAAdgAgHgAAfgAgHwAAgwEAIAEAAAB2ACABAAAAeQAgAwwAAIoEACAkAACMBAAgJQAAiwQAIAm6AQAAxgIAMLsBAACMAQAQvAEAAMYCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHtAQEAmAIAIe4BAQCYAgAh7wFAAJwCACEDAAAAeQAgAQAAiwEAMCMAAIwBACADAAAAeQAgAQAAegAwAgAAdgAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAIAwAAiAQAIAYAAIkEACC9AQEAAAABxQFAAAAAAcYBQAAAAAHWAQEAAAAB6wEBAAAAAewBAQAAAAEBFwAAlAEAIAa9AQEAAAABxQFAAAAAAcYBQAAAAAHWAQEAAAAB6wEBAAAAAewBAQAAAAEBFwAAlgEAMAEXAACWAQAwCAMAAP0DACAGAAD-AwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHrAQEA-AIAIewBAQD4AgAhAgAAAAkAIBcAAJkBACAGvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHrAQEA-AIAIewBAQD4AgAhAgAAAAcAIBcAAJsBACACAAAABwAgFwAAmwEAIAMAAAAJACAeAACUAQAgHwAAmQEAIAEAAAAJACABAAAABwAgAwwAAPoDACAkAAD8AwAgJQAA-wMAIAm6AQAAxQIAMLsBAACiAQAQvAEAAMUCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHWAQEAmAIAIesBAQCYAgAh7AEBAJgCACEDAAAABwAgAQAAoQEAMCMAAKIBACADAAAABwAgAQAACAAwAgAACQAgAQAAAA0AIAEAAAANACADAAAACwAgAQAADAAwAgAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACARBQAA3gMAIAgAAPkDACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQIBFwAAqgEAIA29AQEAAAABwwEAAADrAQLFAUAAAAABxgFAAAAAAdUBAQAAAAHWAQEAAAAB2wECAAAAAd0BAQAAAAHjAQEAAAAB5AEgAAAAAeYBAAAA5gEC5wEBAAAAAekBAAAA6QECARcAAKwBADABFwAArAEAMBEFAADGAwAgCAAA-AMAIAsAAMcDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASICAAAADQAgFwAArwEAIA29AQEA-AIAIcMBAADEA-sBIsUBQAD7AgAhxgFAAPsCACHVAQEA_AIAIdYBAQD8AgAh2wECAPkCACHdAQEA-AIAIeMBAQD4AgAh5AEgAMEDACHmAQAAwgPmASLnAQEA-AIAIekBAADDA-kBIgIAAAALACAXAACxAQAgAgAAAAsAIBcAALEBACADAAAADQAgHgAAqgEAIB8AAK8BACABAAAADQAgAQAAAAsAIAcMAADzAwAgJAAA9gMAICUAAPUDACB2AAD0AwAgdwAA9wMAINUBAADyAgAg1gEAAPICACAQugEAALgCADC7AQAAuAEAELwBAAC4AgAwvQEBAJgCACHDAQAAvALrASLFAUAAnAIAIcYBQACcAgAh1QEBAJkCACHWAQEAmQIAIdsBAgCaAgAh3QEBAJgCACHjAQEAmAIAIeQBIAC5AgAh5gEAALoC5gEi5wEBAJgCACHpAQAAuwLpASIDAAAACwAgAQAAtwEAMCMAALgBACADAAAACwAgAQAADAAwAgAADQAgAQAAABIAIAEAAAASACADAAAAEAAgAQAAEQAwAgAAEgAgAwAAABAAIAEAABEAMAIAABIAIAMAAAAQACABAAARADACAAASACAOBwAAtQMAIAgAAPIDACALAAC2AwAgvQEBAAAAAb4BAQAAAAHDAQAAAOEBAsUBQAAAAAHGAUAAAAAB1AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeEBAgAAAAHiAQEAAAABARcAAMABACALvQEBAAAAAb4BAQAAAAHDAQAAAOEBAsUBQAAAAAHGAUAAAAAB1AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAAAAAeEBAgAAAAHiAQEAAAABARcAAMIBADABFwAAwgEAMA4HAACjAwAgCAAA8QMAIAsAAKQDACC9AQEA-AIAIb4BAQD4AgAhwwEAAKED4QEixQFAAPsCACHGAUAA-wIAIdQBAQD4AgAh3QEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQIAAAASACAXAADFAQAgC70BAQD4AgAhvgEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhAgAAABAAIBcAAMcBACACAAAAEAAgFwAAxwEAIAMAAAASACAeAADAAQAgHwAAxQEAIAEAAAASACABAAAAEAAgCAwAAOwDACAkAADvAwAgJQAA7gMAIHYAAO0DACB3AADwAwAg3gEAAPICACDfAQAA8gIAIOIBAADyAgAgDroBAAC0AgAwuwEAAM4BABC8AQAAtAIAML0BAQCYAgAhvgEBAJgCACHDAQAAtQLhASLFAUAAnAIAIcYBQACcAgAh1AEBAJgCACHdAQEAmAIAId4BAQCZAgAh3wEBAJkCACHhAQIAmgIAIeIBAQCZAgAhAwAAABAAIAEAAM0BADAjAADOAQAgAwAAABAAIAEAABEAMAIAABIAIAEAAAAWACABAAAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgCQkAALMDACAKAADcAwAgvQEBAAAAAb8BAQAAAAHFAUAAAAABxgFAAAAAAdoBAQAAAAHbAQgAAAAB3AECAAAAAQEXAADWAQAgB70BAQAAAAG_AQEAAAABxQFAAAAAAcYBQAAAAAHaAQEAAAAB2wEIAAAAAdwBAgAAAAEBFwAA2AEAMAEXAADYAQAwCQkAALEDACAKAADaAwAgvQEBAPgCACG_AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHaAQEA-AIAIdsBCACvAwAh3AECAPkCACECAAAAFgAgFwAA2wEAIAe9AQEA-AIAIb8BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdoBAQD4AgAh2wEIAK8DACHcAQIA-QIAIQIAAAAUACAXAADdAQAgAgAAABQAIBcAAN0BACADAAAAFgAgHgAA1gEAIB8AANsBACABAAAAFgAgAQAAABQAIAUMAADnAwAgJAAA6gMAICUAAOkDACB2AADoAwAgdwAA6wMAIAq6AQAAsQIAMLsBAADkAQAQvAEAALECADC9AQEAmAIAIb8BAQCYAgAhxQFAAJwCACHGAUAAnAIAIdoBAQCYAgAh2wEIALICACHcAQIAmgIAIQMAAAAUACABAADjAQAwIwAA5AEAIAMAAAAUACABAAAVADACAAAWACAOAwAAsAIAIAYAAK4CACANAACvAgAgugEAAKoCADC7AQAAJwAQvAEAAKoCADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdIBAQAAAAHTAQEAqwIAIdQBAQCrAgAh1QEBAKwCACHWAQEArAIAIQEAAADnAQAgAQAAAOcBACAFAwAA5gMAIAYAAOQDACANAADlAwAg1QEAAPICACDWAQAA8gIAIAMAAAAnACABAADqAQAwAgAA5wEAIAMAAAAnACABAADqAQAwAgAA5wEAIAMAAAAnACABAADqAQAwAgAA5wEAIAsDAADjAwAgBgAA4QMAIA0AAOIDACC9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQEXAADuAQAgCL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAABARcAAPABADABFwAA8AEAMAsDAACWAwAgBgAAlAMAIA0AAJUDACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhAgAAAOcBACAXAADzAQAgCL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh0wEBAPgCACHUAQEA-AIAIdUBAQD8AgAh1gEBAPwCACECAAAAJwAgFwAA9QEAIAIAAAAnACAXAAD1AQAgAwAAAOcBACAeAADuAQAgHwAA8wEAIAEAAADnAQAgAQAAACcAIAUMAACRAwAgJAAAkwMAICUAAJIDACDVAQAA8gIAINYBAADyAgAgC7oBAACpAgAwuwEAAPwBABC8AQAAqQIAML0BAQCYAgAhxQFAAJwCACHGAUAAnAIAIdIBAQCYAgAh0wEBAJgCACHUAQEAmAIAIdUBAQCZAgAh1gEBAJkCACEDAAAAJwAgAQAA-wEAMCMAAPwBACADAAAAJwAgAQAA6gEAMAIAAOcBACABAAAAHgAgAQAAAB4AIAMAAAAcACABAAAdADACAAAeACADAAAAHAAgAQAAHQAwAgAAHgAgAwAAABwAIAEAAB0AMAIAAB4AIA0HAACNAwAgCQAAjgMAIA4AAJADACAPAACPAwAgvQEBAAAAAb4BAQAAAAG_AQEAAAABwAEBAAAAAcEBAgAAAAHDAQAAAMMBAsQBAQAAAAHFAUAAAAABxgFAAAAAAQEXAACEAgAgCb0BAQAAAAG-AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEBFwAAhgIAMAEXAACGAgAwAQAAABwAIA0HAAD9AgAgCQAA_gIAIA4AAP8CACAPAACAAwAgvQEBAPgCACG-AQEA-AIAIb8BAQD4AgAhwAEBAPwCACHBAQIA-QIAIcMBAAD6AsMBIsQBAQD4AgAhxQFAAPsCACHGAUAA-wIAIQIAAAAeACAXAACKAgAgCb0BAQD4AgAhvgEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-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-wEBAKsCACH8ASAA1QIAIf0BAQCsAgAh_wEAANYC_wEigQIgANUCACGCAgAANAAggwIAADQAIAq6AQAAsQIAMLsBAADkAQAQvAEAALECADC9AQEAmAIAIb8BAQCYAgAhxQFAAJwCACHGAUAAnAIAIdoBAQCYAgAh2wEIALICACHcAQIAmgIAIQ0MAACeAgAgJAAAowIAICUAAKMCACB2AACjAgAgdwAAowIAIMcBCAAAAAHIAQgAAAAEyQEIAAAABMoBCAAAAAHLAQgAAAABzAEIAAAAAc0BCAAAAAHOAQgAswIAIQ0MAACeAgAgJAAAowIAICUAAKMCACB2AACjAgAgdwAAowIAIMcBCAAAAAHIAQgAAAAEyQEIAAAABMoBCAAAAAHLAQgAAAABzAEIAAAAAc0BCAAAAAHOAQgAswIAIQ66AQAAtAIAMLsBAADOAQAQvAEAALQCADC9AQEAmAIAIb4BAQCYAgAhwwEAALUC4QEixQFAAJwCACHGAUAAnAIAIdQBAQCYAgAh3QEBAJgCACHeAQEAmQIAId8BAQCZAgAh4QECAJoCACHiAQEAmQIAIQcMAACeAgAgJAAAtwIAICUAALcCACDHAQAAAOEBAsgBAAAA4QEIyQEAAADhAQjOAQAAtgLhASIHDAAAngIAICQAALcCACAlAAC3AgAgxwEAAADhAQLIAQAAAOEBCMkBAAAA4QEIzgEAALYC4QEiBMcBAAAA4QECyAEAAADhAQjJAQAAAOEBCM4BAAC3AuEBIhC6AQAAuAIAMLsBAAC4AQAQvAEAALgCADC9AQEAmAIAIcMBAAC8AusBIsUBQACcAgAhxgFAAJwCACHVAQEAmQIAIdYBAQCZAgAh2wECAJoCACHdAQEAmAIAIeMBAQCYAgAh5AEgALkCACHmAQAAugLmASLnAQEAmAIAIekBAAC7AukBIgUMAACeAgAgJAAAxAIAICUAAMQCACDHASAAAAABzgEgAMMCACEHDAAAngIAICQAAMICACAlAADCAgAgxwEAAADmAQLIAQAAAOYBCMkBAAAA5gEIzgEAAMEC5gEiBwwAAJ4CACAkAADAAgAgJQAAwAIAIMcBAAAA6QECyAEAAADpAQjJAQAAAOkBCM4BAAC_AukBIgcMAACeAgAgJAAAvgIAICUAAL4CACDHAQAAAOsBAsgBAAAA6wEIyQEAAADrAQjOAQAAvQLrASIHDAAAngIAICQAAL4CACAlAAC-AgAgxwEAAADrAQLIAQAAAOsBCMkBAAAA6wEIzgEAAL0C6wEiBMcBAAAA6wECyAEAAADrAQjJAQAAAOsBCM4BAAC-AusBIgcMAACeAgAgJAAAwAIAICUAAMACACDHAQAAAOkBAsgBAAAA6QEIyQEAAADpAQjOAQAAvwLpASIExwEAAADpAQLIAQAAAOkBCMkBAAAA6QEIzgEAAMAC6QEiBwwAAJ4CACAkAADCAgAgJQAAwgIAIMcBAAAA5gECyAEAAADmAQjJAQAAAOYBCM4BAADBAuYBIgTHAQAAAOYBAsgBAAAA5gEIyQEAAADmAQjOAQAAwgLmASIFDAAAngIAICQAAMQCACAlAADEAgAgxwEgAAAAAc4BIADDAgAhAscBIAAAAAHOASAAxAIAIQm6AQAAxQIAMLsBAACiAQAQvAEAAMUCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHWAQEAmAIAIesBAQCYAgAh7AEBAJgCACEJugEAAMYCADC7AQAAjAEAELwBAADGAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh7QEBAJgCACHuAQEAmAIAIe8BQACcAgAhCboBAADHAgAwuwEAAHkAELwBAADHAgAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh7QEBAKsCACHuAQEAqwIAIe8BQACtAgAhELoBAADIAgAwuwEAAHMAELwBAADIAgAwvQEBAJgCACHFAUAAnAIAIcYBQACcAgAh0gEBAJgCACHdAQEAmAIAIfABAQCYAgAh8QEBAJkCACHyAQEAmQIAIfMBAQCZAgAh9AFAAMkCACH1AUAAyQIAIfYBAQCZAgAh9wEBAJkCACELDAAApQIAICQAAMsCACAlAADLAgAgxwFAAAAAAcgBQAAAAAXJAUAAAAAFygFAAAAAAcsBQAAAAAHMAUAAAAABzQFAAAAAAc4BQADKAgAhCwwAAKUCACAkAADLAgAgJQAAywIAIMcBQAAAAAHIAUAAAAAFyQFAAAAABcoBQAAAAAHLAUAAAAABzAFAAAAAAc0BQAAAAAHOAUAAygIAIQjHAUAAAAAByAFAAAAABckBQAAAAAXKAUAAAAABywFAAAAAAcwBQAAAAAHNAUAAAAABzgFAAMsCACELugEAAMwCADC7AQAAXQAQvAEAAMwCADC9AQEAmAIAIcUBQACcAgAhxgFAAJwCACHSAQEAmAIAIe8BQACcAgAh-AEBAJgCACH5AQEAmQIAIfoBAQCZAgAhD7oBAADNAgAwuwEAAEcAELwBAADNAgAwvQEBAJgCACHDAQAAzwKBAiLFAUAAnAIAIcYBQACcAgAh1gEBAJkCACHiAQEAmAIAIewBAQCYAgAh-wEBAJgCACH8ASAAuQIAIf0BAQCZAgAh_wEAAM4C_wEigQIgALkCACEHDAAAngIAICQAANMCACAlAADTAgAgxwEAAAD_AQLIAQAAAP8BCMkBAAAA_wEIzgEAANIC_wEiBwwAAJ4CACAkAADRAgAgJQAA0QIAIMcBAAAAgQICyAEAAACBAgjJAQAAAIECCM4BAADQAoECIgcMAACeAgAgJAAA0QIAICUAANECACDHAQAAAIECAsgBAAAAgQIIyQEAAACBAgjOAQAA0AKBAiIExwEAAACBAgLIAQAAAIECCMkBAAAAgQIIzgEAANECgQIiBwwAAJ4CACAkAADTAgAgJQAA0wIAIMcBAAAA_wECyAEAAAD_AQjJAQAAAP8BCM4BAADSAv8BIgTHAQAAAP8BAsgBAAAA_wEIyQEAAAD_AQjOAQAA0wL_ASIVBAAA2AIAIAUAANkCACAIAADaAgAgDQAArwIAIBAAANsCACARAADcAgAgugEAANQCADC7AQAANAAQvAEAANQCADC9AQEAqwIAIcMBAADXAoECIsUBQACtAgAhxgFAAK0CACHWAQEArAIAIeIBAQCrAgAh7AEBAKsCACH7AQEAqwIAIfwBIADVAgAh_QEBAKwCACH_AQAA1gL_ASKBAiAA1QIAIQLHASAAAAABzgEgAMQCACEExwEAAAD_AQLIAQAAAP8BCMkBAAAA_wEIzgEAANMC_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_AQEA-AIAIcEBAgD5AgAhwwEAAPoCwwEixAEBAPgCACHFAUAA-wIAIcYBQAD7AgAhCwcAAP0CACAJAAD-AgAgDwAAgAMAIL0BAQD4AgAhvgEBAPgCACG_AQEA-AIAIcEBAgD5AgAhwwEAAPoCwwEixAEBAPgCACHFAUAA-wIAIcYBQAD7AgAhCwcAAI0DACAJAACOAwAgDwAAjwMAIL0BAQAAAAG-AQEAAAABvwEBAAAAAcEBAgAAAAHDAQAAAMMBAsQBAQAAAAHFAUAAAAABxgFAAAAAAQMeAACvBQAghAIAALAFACCKAgAAAQAgAx4AAK0FACCEAgAArgUAIIoCAAANACAEHgAAgQMAMIQCAACCAwAwhgIAAIQDACCKAgAAhQMAMAMeAACrBQAghAIAAKwFACCKAgAAHgAgAAAACx4AALcDADAfAAC8AwAwhAIAALgDADCFAgAAuQMAMIYCAAC6AwAghwIAALsDADCIAgAAuwMAMIkCAAC7AwAwigIAALsDADCLAgAAvQMAMIwCAAC-AwAwCx4AAJcDADAfAACcAwAwhAIAAJgDADCFAgAAmQMAMIYCAACaAwAghwIAAJsDADCIAgAAmwMAMIkCAACbAwAwigIAAJsDADCLAgAAnQMAMIwCAACeAwAwBR4AAI0FACAfAACpBQAghAIAAI4FACCFAgAAqAUAIIoCAAABACAMBwAAtQMAIAsAALYDACC9AQEAAAABvgEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQIAAAASACAeAAC0AwAgAwAAABIAIB4AALQDACAfAACiAwAgARcAAKcFADARBwAAsAIAIAgAAOgCACALAADpAgAgugEAAOYCADC7AQAAEAAQvAEAAOYCADC9AQEAAAABvgEBAKsCACHDAQAA5wLhASLFAUAArQIAIcYBQACtAgAh1AEBAKsCACHdAQEAqwIAId4BAQCsAgAh3wEBAKwCACHhAQIA3wIAIeIBAQCsAgAhAgAAABIAIBcAAKIDACACAAAAnwMAIBcAAKADACAOugEAAJ4DADC7AQAAnwMAELwBAACeAwAwvQEBAKsCACG-AQEAqwIAIcMBAADnAuEBIsUBQACtAgAhxgFAAK0CACHUAQEAqwIAId0BAQCrAgAh3gEBAKwCACHfAQEArAIAIeEBAgDfAgAh4gEBAKwCACEOugEAAJ4DADC7AQAAnwMAELwBAACeAwAwvQEBAKsCACG-AQEAqwIAIcMBAADnAuEBIsUBQACtAgAhxgFAAK0CACHUAQEAqwIAId0BAQCrAgAh3gEBAKwCACHfAQEArAIAIeEBAgDfAgAh4gEBAKwCACEKvQEBAPgCACG-AQEA-AIAIcMBAAChA-EBIsUBQAD7AgAhxgFAAPsCACHUAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhAYcCAAAA4QECDAcAAKMDACALAACkAwAgvQEBAPgCACG-AQEA-AIAIcMBAAChA-EBIsUBQAD7AgAhxgFAAPsCACHUAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhBR4AAJwFACAfAAClBQAghAIAAJ0FACCFAgAApAUAIIoCAAABACALHgAApQMAMB8AAKoDADCEAgAApgMAMIUCAACnAwAwhgIAAKgDACCHAgAAqQMAMIgCAACpAwAwiQIAAKkDADCKAgAAqQMAMIsCAACrAwAwjAIAAKwDADAHCQAAswMAIL0BAQAAAAG_AQEAAAABxQFAAAAAAcYBQAAAAAHbAQgAAAAB3AECAAAAAQIAAAAWACAeAACyAwAgAwAAABYAIB4AALIDACAfAACwAwAgARcAAKMFADAMCQAA4QIAIAoAAOUCACC6AQAA4wIAMLsBAAAUABC8AQAA4wIAML0BAQAAAAG_AQEAqwIAIcUBQACtAgAhxgFAAK0CACHaAQEAqwIAIdsBCADkAgAh3AECAN8CACECAAAAFgAgFwAAsAMAIAIAAACtAwAgFwAArgMAIAq6AQAArAMAMLsBAACtAwAQvAEAAKwDADC9AQEAqwIAIb8BAQCrAgAhxQFAAK0CACHGAUAArQIAIdoBAQCrAgAh2wEIAOQCACHcAQIA3wIAIQq6AQAArAMAMLsBAACtAwAQvAEAAKwDADC9AQEAqwIAIb8BAQCrAgAhxQFAAK0CACHGAUAArQIAIdoBAQCrAgAh2wEIAOQCACHcAQIA3wIAIQa9AQEA-AIAIb8BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdsBCACvAwAh3AECAPkCACEFhwIIAAAAAY0CCAAAAAGOAggAAAABjwIIAAAAAZACCAAAAAEHCQAAsQMAIL0BAQD4AgAhvwEBAPgCACHFAUAA-wIAIcYBQAD7AgAh2wEIAK8DACHcAQIA-QIAIQUeAACeBQAgHwAAoQUAIIQCAACfBQAghQIAAKAFACCKAgAADQAgBwkAALMDACC9AQEAAAABvwEBAAAAAcUBQAAAAAHGAUAAAAAB2wEIAAAAAdwBAgAAAAEDHgAAngUAIIQCAACfBQAgigIAAA0AIAwHAAC1AwAgCwAAtgMAIL0BAQAAAAG-AQEAAAABwwEAAADhAQLFAUAAAAABxgFAAAAAAdQBAQAAAAHeAQEAAAAB3wEBAAAAAeEBAgAAAAHiAQEAAAABAx4AAJwFACCEAgAAnQUAIIoCAAABACAEHgAApQMAMIQCAACmAwAwhgIAAKgDACCKAgAAqQMAMA8FAADeAwAgCwAA3wMAIBAAAOADACC9AQEAAAABwwEAAADrAQLFAUAAAAABxgFAAAAAAdUBAQAAAAHWAQEAAAAB2wECAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQICAAAADQAgHgAA3QMAIAMAAAANACAeAADdAwAgHwAAxQMAIAEXAACbBQAwFAUAAO4CACAIAADoAgAgCwAA6QIAIBAAANsCACC6AQAA6gIAMLsBAAALABC8AQAA6gIAML0BAQAAAAHDAQAA7QLrASLFAUAArQIAIcYBQACtAgAh1QEBAKwCACHWAQEArAIAIdsBAgDfAgAh3QEBAKsCACHjAQEAqwIAIeQBIADVAgAh5gEAAOsC5gEi5wEBAKsCACHpAQAA7ALpASICAAAADQAgFwAAxQMAIAIAAAC_AwAgFwAAwAMAIBC6AQAAvgMAMLsBAAC_AwAQvAEAAL4DADC9AQEAqwIAIcMBAADtAusBIsUBQACtAgAhxgFAAK0CACHVAQEArAIAIdYBAQCsAgAh2wECAN8CACHdAQEAqwIAIeMBAQCrAgAh5AEgANUCACHmAQAA6wLmASLnAQEAqwIAIekBAADsAukBIhC6AQAAvgMAMLsBAAC_AwAQvAEAAL4DADC9AQEAqwIAIcMBAADtAusBIsUBQACtAgAhxgFAAK0CACHVAQEArAIAIdYBAQCsAgAh2wECAN8CACHdAQEAqwIAIeMBAQCrAgAh5AEgANUCACHmAQAA6wLmASLnAQEAqwIAIekBAADsAukBIgy9AQEA-AIAIcMBAADEA-sBIsUBQAD7AgAhxgFAAPsCACHVAQEA_AIAIdYBAQD8AgAh2wECAPkCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIBhwIgAAAAAQGHAgAAAOYBAgGHAgAAAOkBAgGHAgAAAOsBAg8FAADGAwAgCwAAxwMAIBAAAMgDACC9AQEA-AIAIcMBAADEA-sBIsUBQAD7AgAhxgFAAPsCACHVAQEA_AIAIdYBAQD8AgAh2wECAPkCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIFHgAAjwUAIB8AAJkFACCEAgAAkAUAIIUCAACYBQAgigIAAAkAIAseAADSAwAwHwAA1gMAMIQCAADTAwAwhQIAANQDADCGAgAA1QMAIIcCAACpAwAwiAIAAKkDADCJAgAAqQMAMIoCAACpAwAwiwIAANcDADCMAgAArAMAMAseAADJAwAwHwAAzQMAMIQCAADKAwAwhQIAAMsDADCGAgAAzAMAIIcCAACFAwAwiAIAAIUDADCJAgAAhQMAMIoCAACFAwAwiwIAAM4DADCMAgAAiAMAMAsHAACNAwAgDgAAkAMAIA8AAI8DACC9AQEAAAABvgEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAECAAAAHgAgHgAA0QMAIAMAAAAeACAeAADRAwAgHwAA0AMAIAEXAACXBQAwAgAAAB4AIBcAANADACACAAAAiQMAIBcAAM8DACAIvQEBAPgCACG-AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELBwAA_QIAIA4AAP8CACAPAACAAwAgvQEBAPgCACG-AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELBwAAjQMAIA4AAJADACAPAACPAwAgvQEBAAAAAb4BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABBwoAANwDACC9AQEAAAABxQFAAAAAAcYBQAAAAAHaAQEAAAAB2wEIAAAAAdwBAgAAAAECAAAAFgAgHgAA2wMAIAMAAAAWACAeAADbAwAgHwAA2QMAIAEXAACWBQAwAgAAABYAIBcAANkDACACAAAArQMAIBcAANgDACAGvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh2gEBAPgCACHbAQgArwMAIdwBAgD5AgAhBwoAANoDACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHaAQEA-AIAIdsBCACvAwAh3AECAPkCACEFHgAAkQUAIB8AAJQFACCEAgAAkgUAIIUCAACTBQAgigIAABIAIAcKAADcAwAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB2gEBAAAAAdsBCAAAAAHcAQIAAAABAx4AAJEFACCEAgAAkgUAIIoCAAASACAPBQAA3gMAIAsAAN8DACAQAADgAwAgvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHjAQEAAAAB5AEgAAAAAeYBAAAA5gEC5wEBAAAAAekBAAAA6QECAx4AAI8FACCEAgAAkAUAIIoCAAAJACAEHgAA0gMAMIQCAADTAwAwhgIAANUDACCKAgAAqQMAMAQeAADJAwAwhAIAAMoDADCGAgAAzAMAIIoCAACFAwAwBB4AALcDADCEAgAAuAMAMIYCAAC6AwAgigIAALsDADAEHgAAlwMAMIQCAACYAwAwhgIAAJoDACCKAgAAmwMAMAMeAACNBQAghAIAAI4FACCKAgAAAQAgAAAIBAAA5AQAIAUAAOUEACAIAADmBAAgDQAA5QMAIBAAAOcEACARAADoBAAg1gEAAPICACD9AQAA8gIAIAAAAAAAAAAAAAAFHgAAiAUAIB8AAIsFACCEAgAAiQUAIIUCAACKBQAgigIAAOcBACADHgAAiAUAIIQCAACJBQAgigIAAOcBACAAAAAAAAUeAACDBQAgHwAAhgUAIIQCAACEBQAghQIAAIUFACCKAgAA5wEAIAMeAACDBQAghAIAAIQFACCKAgAA5wEAIAAAAAUeAAD9BAAgHwAAgQUAIIQCAAD-BAAghQIAAIAFACCKAgAAAQAgCx4AAP8DADAfAACDBAAwhAIAAIAEADCFAgAAgQQAMIYCAACCBAAghwIAALsDADCIAgAAuwMAMIkCAAC7AwAwigIAALsDADCLAgAAhAQAMIwCAAC-AwAwDwgAAPkDACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLpAQAAAOkBAgIAAAANACAeAACHBAAgAwAAAA0AIB4AAIcEACAfAACGBAAgARcAAP8EADACAAAADQAgFwAAhgQAIAIAAAC_AwAgFwAAhQQAIAy9AQEA-AIAIcMBAADEA-sBIsUBQAD7AgAhxgFAAPsCACHVAQEA_AIAIdYBAQD8AgAh2wECAPkCACHdAQEA-AIAIeMBAQD4AgAh5AEgAMEDACHmAQAAwgPmASLpAQAAwwPpASIPCAAA-AMAIAsAAMcDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi6QEAAMMD6QEiDwgAAPkDACALAADfAwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLpAQAAAOkBAgMeAAD9BAAghAIAAP4EACCKAgAAAQAgBB4AAP8DADCEAgAAgAQAMIYCAACCBAAgigIAALsDADAAAAAAAAABhwJAAAAAAQUeAAD4BAAgHwAA-wQAIIQCAAD5BAAghQIAAPoEACCKAgAAAQAgAx4AAPgEACCEAgAA-QQAIIoCAAABACAAAAAFHgAA8wQAIB8AAPYEACCEAgAA9AQAIIUCAAD1BAAgigIAAAEAIAMeAADzBAAghAIAAPQEACCKAgAAAQAgAAAAAYcCAAAA_wECAYcCAAAAgQICCx4AANIEADAfAADXBAAwhAIAANMEADCFAgAA1AQAMIYCAADVBAAghwIAANYEADCIAgAA1gQAMIkCAADWBAAwigIAANYEADCLAgAA2AQAMIwCAADZBAAwCx4AAMYEADAfAADLBAAwhAIAAMcEADCFAgAAyAQAMIYCAADJBAAghwIAAMoEADCIAgAAygQAMIkCAADKBAAwigIAAMoEADCLAgAAzAQAMIwCAADNBAAwCx4AAL0EADAfAADBBAAwhAIAAL4EADCFAgAAvwQAMIYCAADABAAghwIAAJsDADCIAgAAmwMAMIkCAACbAwAwigIAAJsDADCLAgAAwgQAMIwCAACeAwAwBx4AALgEACAfAAC7BAAghAIAALkEACCFAgAAugQAIIgCAAAnACCJAgAAJwAgigIAAOcBACALHgAArwQAMB8AALMEADCEAgAAsAQAMIUCAACxBAAwhgIAALIEACCHAgAAhQMAMIgCAACFAwAwiQIAAIUDADCKAgAAhQMAMIsCAAC0BAAwjAIAAIgDADALHgAAowQAMB8AAKgEADCEAgAApAQAMIUCAAClBAAwhgIAAKYEACCHAgAApwQAMIgCAACnBAAwiQIAAKcEADCKAgAApwQAMIsCAACpBAAwjAIAAKoEADAHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQIAAAAsACAeAACuBAAgAwAAACwAIB4AAK4EACAfAACtBAAgARcAAPIEADAMAwAAsAIAILoBAADdAgAwuwEAACoAELwBAADdAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAAAAAfkBAQCsAgAh-gEBAKwCACECAAAALAAgFwAArQQAIAIAAACrBAAgFwAArAQAIAu6AQAAqgQAMLsBAACrBAAQvAEAAKoEADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHSAQEAqwIAIe8BQACtAgAh-AEBAKsCACH5AQEArAIAIfoBAQCsAgAhC7oBAACqBAAwuwEAAKsEABC8AQAAqgQAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh7wFAAK0CACH4AQEAqwIAIfkBAQCsAgAh-gEBAKwCACEHvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACEHvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh7wFAAPsCACH4AQEA-AIAIfkBAQD8AgAh-gEBAPwCACEHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAQsJAACOAwAgDgAAkAMAIA8AAI8DACC9AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAECAAAAHgAgHgAAtwQAIAMAAAAeACAeAAC3BAAgHwAAtgQAIAEXAADxBAAwAgAAAB4AIBcAALYEACACAAAAiQMAIBcAALUEACAIvQEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELCQAA_gIAIA4AAP8CACAPAACAAwAgvQEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACELCQAAjgMAIA4AAJADACAPAACPAwAgvQEBAAAAAb8BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABCQYAAOEDACANAADiAwAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQIAAADnAQAgHgAAuAQAIAMAAAAnACAeAAC4BAAgHwAAvAQAIAsAAAAnACAGAACUAwAgDQAAlQMAIBcAALwEACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHTAQEA-AIAIdQBAQD4AgAh1QEBAPwCACHWAQEA_AIAIQkGAACUAwAgDQAAlQMAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhDAgAAPIDACALAAC2AwAgvQEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAECAAAAEgAgHgAAxQQAIAMAAAASACAeAADFBAAgHwAAxAQAIAEXAADwBAAwAgAAABIAIBcAAMQEACACAAAAnwMAIBcAAMMEACAKvQEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhDAgAAPEDACALAACkAwAgvQEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhDAgAAPIDACALAAC2AwAgvQEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAEGBgAAiQQAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdYBAQAAAAHsAQEAAAABAgAAAAkAIB4AANEEACADAAAACQAgHgAA0QQAIB8AANAEACABFwAA7wQAMAsDAACwAgAgBgAArgIAILoBAADvAgAwuwEAAAcAELwBAADvAgAwvQEBAAAAAcUBQACtAgAhxgFAAK0CACHWAQEAqwIAIesBAQCrAgAh7AEBAAAAAQIAAAAJACAXAADQBAAgAgAAAM4EACAXAADPBAAgCboBAADNBAAwuwEAAM4EABC8AQAAzQQAML0BAQCrAgAhxQFAAK0CACHGAUAArQIAIdYBAQCrAgAh6wEBAKsCACHsAQEAqwIAIQm6AQAAzQQAMLsBAADOBAAQvAEAAM0EADC9AQEAqwIAIcUBQACtAgAhxgFAAK0CACHWAQEAqwIAIesBAQCrAgAh7AEBAKsCACEFvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHsAQEA-AIAIQYGAAD-AwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh1gEBAPgCACHsAQEA-AIAIQYGAACJBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAewBAQAAAAEMvQEBAAAAAcUBQAAAAAHGAUAAAAAB3QEBAAAAAfABAQAAAAHxAQEAAAAB8gEBAAAAAfMBAQAAAAH0AUAAAAAB9QFAAAAAAfYBAQAAAAH3AQEAAAABAgAAAAUAIB4AAN0EACADAAAABQAgHgAA3QQAIB8AANwEACABFwAA7gQAMBEDAACwAgAgugEAAPACADC7AQAAAwAQvAEAAPACADC9AQEAAAABxQFAAK0CACHGAUAArQIAIdIBAQCrAgAh3QEBAKsCACHwAQEAqwIAIfEBAQCsAgAh8gEBAKwCACHzAQEArAIAIfQBQADxAgAh9QFAAPECACH2AQEArAIAIfcBAQCsAgAhAgAAAAUAIBcAANwEACACAAAA2gQAIBcAANsEACAQugEAANkEADC7AQAA2gQAELwBAADZBAAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHdAQEAqwIAIfABAQCrAgAh8QEBAKwCACHyAQEArAIAIfMBAQCsAgAh9AFAAPECACH1AUAA8QIAIfYBAQCsAgAh9wEBAKwCACEQugEAANkEADC7AQAA2gQAELwBAADZBAAwvQEBAKsCACHFAUAArQIAIcYBQACtAgAh0gEBAKsCACHdAQEAqwIAIfABAQCrAgAh8QEBAKwCACHyAQEArAIAIfMBAQCsAgAh9AFAAPECACH1AUAA8QIAIfYBAQCsAgAh9wEBAKwCACEMvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh3QEBAPgCACHwAQEA-AIAIfEBAQD8AgAh8gEBAPwCACHzAQEA_AIAIfQBQACQBAAh9QFAAJAEACH2AQEA_AIAIfcBAQD8AgAhDL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAId0BAQD4AgAh8AEBAPgCACHxAQEA_AIAIfIBAQD8AgAh8wEBAPwCACH0AUAAkAQAIfUBQACQBAAh9gEBAPwCACH3AQEA_AIAIQy9AQEAAAABxQFAAAAAAcYBQAAAAAHdAQEAAAAB8AEBAAAAAfEBAQAAAAHyAQEAAAAB8wEBAAAAAfQBQAAAAAH1AUAAAAAB9gEBAAAAAfcBAQAAAAEEHgAA0gQAMIQCAADTBAAwhgIAANUEACCKAgAA1gQAMAQeAADGBAAwhAIAAMcEADCGAgAAyQQAIIoCAADKBAAwBB4AAL0EADCEAgAAvgQAMIYCAADABAAgigIAAJsDADADHgAAuAQAIIQCAAC5BAAgigIAAOcBACAEHgAArwQAMIQCAACwBAAwhgIAALIEACCKAgAAhQMAMAQeAACjBAAwhAIAAKQEADCGAgAApgQAIIoCAACnBAAwAAAFAwAA5gMAIAYAAOQDACANAADlAwAg1QEAAPICACDWAQAA8gIAIAAABgUAAO0EACAIAADmBAAgCwAA7AQAIBAAAOcEACDVAQAA8gIAINYBAADyAgAgBQcAAOYDACAJAADpBAAgDgAA6gQAIA8AAOcEACDAAQAA8gIAIAYHAADmAwAgCAAA5gQAIAsAAOwEACDeAQAA8gIAIN8BAADyAgAg4gEAAPICACAAAgMAAOYDACAGAADkAwAgDL0BAQAAAAHFAUAAAAABxgFAAAAAAd0BAQAAAAHwAQEAAAAB8QEBAAAAAfIBAQAAAAHzAQEAAAAB9AFAAAAAAfUBQAAAAAH2AQEAAAAB9wEBAAAAAQW9AQEAAAABxQFAAAAAAcYBQAAAAAHWAQEAAAAB7AEBAAAAAQq9AQEAAAABwwEAAADhAQLFAUAAAAABxgFAAAAAAdQBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQAAAAHhAQIAAAAB4gEBAAAAAQi9AQEAAAABvwEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEHvQEBAAAAAcUBQAAAAAHGAUAAAAAB7wFAAAAAAfgBAQAAAAH5AQEAAAAB-gEBAAAAAREEAADeBAAgBQAA3wQAIAgAAOEEACANAADgBAAgEAAA4gQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAPMEACADAAAANAAgHgAA8wQAIB8AAPcEACATAAAANAAgBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBAAAKEEACAXAAD3BAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBAAAKEEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD4AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIREFAADfBAAgCAAA4QQAIA0AAOAEACAQAADiBAAgEQAA4wQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAPgEACADAAAANAAgHgAA-AQAIB8AAPwEACATAAAANAAgBQAAngQAIAgAAKAEACANAACfBAAgEAAAoQQAIBEAAKIEACAXAAD8BAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBQAAngQAIAgAAKAEACANAACfBAAgEAAAoQQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD4AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIREEAADeBAAgCAAA4QQAIA0AAOAEACAQAADiBAAgEQAA4wQAIL0BAQAAAAHDAQAAAIECAsUBQAAAAAHGAUAAAAAB1gEBAAAAAeIBAQAAAAHsAQEAAAAB-wEBAAAAAfwBIAAAAAH9AQEAAAAB_wEAAAD_AQKBAiAAAAABAgAAAAEAIB4AAP0EACAMvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHdAQEAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAukBAAAA6QECAwAAADQAIB4AAP0EACAfAACCBQAgEwAAADQAIAQAAJ0EACAIAACgBAAgDQAAnwQAIBAAAKEEACARAACiBAAgFwAAggUAIL0BAQD4AgAhwwEAAJwEgQIixQFAAPsCACHGAUAA-wIAIdYBAQD8AgAh4gEBAPgCACHsAQEA-AIAIfsBAQD4AgAh_AEgAMEDACH9AQEA_AIAIf8BAACbBP8BIoECIADBAwAhEQQAAJ0EACAIAACgBAAgDQAAnwQAIBAAAKEEACARAACiBAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACEKAwAA4wMAIA0AAOIDACC9AQEAAAABxQFAAAAAAcYBQAAAAAHSAQEAAAAB0wEBAAAAAdQBAQAAAAHVAQEAAAAB1gEBAAAAAQIAAADnAQAgHgAAgwUAIAMAAAAnACAeAACDBQAgHwAAhwUAIAwAAAAnACADAACWAwAgDQAAlQMAIBcAAIcFACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhCgMAAJYDACANAACVAwAgvQEBAPgCACHFAUAA-wIAIcYBQAD7AgAh0gEBAPgCACHTAQEA-AIAIdQBAQD4AgAh1QEBAPwCACHWAQEA_AIAIQoDAADjAwAgBgAA4QMAIL0BAQAAAAHFAUAAAAABxgFAAAAAAdIBAQAAAAHTAQEAAAAB1AEBAAAAAdUBAQAAAAHWAQEAAAABAgAAAOcBACAeAACIBQAgAwAAACcAIB4AAIgFACAfAACMBQAgDAAAACcAIAMAAJYDACAGAACUAwAgFwAAjAUAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdIBAQD4AgAh0wEBAPgCACHUAQEA-AIAIdUBAQD8AgAh1gEBAPwCACEKAwAAlgMAIAYAAJQDACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHSAQEA-AIAIdMBAQD4AgAh1AEBAPgCACHVAQEA_AIAIdYBAQD8AgAhEQQAAN4EACAFAADfBAAgDQAA4AQAIBAAAOIEACARAADjBAAgvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAECAAAAAQAgHgAAjQUAIAcDAACIBAAgvQEBAAAAAcUBQAAAAAHGAUAAAAAB1gEBAAAAAesBAQAAAAHsAQEAAAABAgAAAAkAIB4AAI8FACANBwAAtQMAIAgAAPIDACC9AQEAAAABvgEBAAAAAcMBAAAA4QECxQFAAAAAAcYBQAAAAAHUAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAECAAAAEgAgHgAAkQUAIAMAAAAQACAeAACRBQAgHwAAlQUAIA8AAAAQACAHAACjAwAgCAAA8QMAIBcAAJUFACC9AQEA-AIAIb4BAQD4AgAhwwEAAKED4QEixQFAAPsCACHGAUAA-wIAIdQBAQD4AgAh3QEBAPgCACHeAQEA_AIAId8BAQD8AgAh4QECAPkCACHiAQEA_AIAIQ0HAACjAwAgCAAA8QMAIL0BAQD4AgAhvgEBAPgCACHDAQAAoQPhASLFAUAA-wIAIcYBQAD7AgAh1AEBAPgCACHdAQEA-AIAId4BAQD8AgAh3wEBAPwCACHhAQIA-QIAIeIBAQD8AgAhBr0BAQAAAAHFAUAAAAABxgFAAAAAAdoBAQAAAAHbAQgAAAAB3AECAAAAAQi9AQEAAAABvgEBAAAAAcABAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEDAAAABwAgHgAAjwUAIB8AAJoFACAJAAAABwAgAwAA_QMAIBcAAJoFACC9AQEA-AIAIcUBQAD7AgAhxgFAAPsCACHWAQEA-AIAIesBAQD4AgAh7AEBAPgCACEHAwAA_QMAIL0BAQD4AgAhxQFAAPsCACHGAUAA-wIAIdYBAQD4AgAh6wEBAPgCACHsAQEA-AIAIQy9AQEAAAABwwEAAADrAQLFAUAAAAABxgFAAAAAAdUBAQAAAAHWAQEAAAAB2wECAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQIRBAAA3gQAIAUAAN8EACAIAADhBAAgEAAA4gQAIBEAAOMEACC9AQEAAAABwwEAAACBAgLFAUAAAAABxgFAAAAAAdYBAQAAAAHiAQEAAAAB7AEBAAAAAfsBAQAAAAH8ASAAAAAB_QEBAAAAAf8BAAAA_wECgQIgAAAAAQIAAAABACAeAACcBQAgEAUAAN4DACAIAAD5AwAgEAAA4AMAIL0BAQAAAAHDAQAAAOsBAsUBQAAAAAHGAUAAAAAB1QEBAAAAAdYBAQAAAAHbAQIAAAAB3QEBAAAAAeMBAQAAAAHkASAAAAAB5gEAAADmAQLnAQEAAAAB6QEAAADpAQICAAAADQAgHgAAngUAIAMAAAALACAeAACeBQAgHwAAogUAIBIAAAALACAFAADGAwAgCAAA-AMAIBAAAMgDACAXAACiBQAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIQBQAAxgMAIAgAAPgDACAQAADIAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIGvQEBAAAAAb8BAQAAAAHFAUAAAAABxgFAAAAAAdsBCAAAAAHcAQIAAAABAwAAADQAIB4AAJwFACAfAACmBQAgEwAAADQAIAQAAJ0EACAFAACeBAAgCAAAoAQAIBAAAKEEACARAACiBAAgFwAApgUAIL0BAQD4AgAhwwEAAJwEgQIixQFAAPsCACHGAUAA-wIAIdYBAQD8AgAh4gEBAPgCACHsAQEA-AIAIfsBAQD4AgAh_AEgAMEDACH9AQEA_AIAIf8BAACbBP8BIoECIADBAwAhEQQAAJ0EACAFAACeBAAgCAAAoAQAIBAAAKEEACARAACiBAAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACEKvQEBAAAAAb4BAQAAAAHDAQAAAOEBAsUBQAAAAAHGAUAAAAAB1AEBAAAAAd4BAQAAAAHfAQEAAAAB4QECAAAAAeIBAQAAAAEDAAAANAAgHgAAjQUAIB8AAKoFACATAAAANAAgBAAAnQQAIAUAAJ4EACANAACfBAAgEAAAoQQAIBEAAKIEACAXAACqBQAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACANAACfBAAgEAAAoQQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD4AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIQwHAACNAwAgCQAAjgMAIA4AAJADACC9AQEAAAABvgEBAAAAAb8BAQAAAAHAAQEAAAABwQECAAAAAcMBAAAAwwECxAEBAAAAAcUBQAAAAAHGAUAAAAABAgAAAB4AIB4AAKsFACAQBQAA3gMAIAgAAPkDACALAADfAwAgvQEBAAAAAcMBAAAA6wECxQFAAAAAAcYBQAAAAAHVAQEAAAAB1gEBAAAAAdsBAgAAAAHdAQEAAAAB4wEBAAAAAeQBIAAAAAHmAQAAAOYBAucBAQAAAAHpAQAAAOkBAgIAAAANACAeAACtBQAgEQQAAN4EACAFAADfBAAgCAAA4QQAIA0AAOAEACARAADjBAAgvQEBAAAAAcMBAAAAgQICxQFAAAAAAcYBQAAAAAHWAQEAAAAB4gEBAAAAAewBAQAAAAH7AQEAAAAB_AEgAAAAAf0BAQAAAAH_AQAAAP8BAoECIAAAAAECAAAAAQAgHgAArwUAIAi9AQEAAAABvgEBAAAAAb8BAQAAAAHBAQIAAAABwwEAAADDAQLEAQEAAAABxQFAAAAAAcYBQAAAAAEDAAAAHAAgHgAAqwUAIB8AALQFACAOAAAAHAAgBwAA_QIAIAkAAP4CACAOAAD_AgAgFwAAtAUAIL0BAQD4AgAhvgEBAPgCACG_AQEA-AIAIcABAQD8AgAhwQECAPkCACHDAQAA-gLDASLEAQEA-AIAIcUBQAD7AgAhxgFAAPsCACEMBwAA_QIAIAkAAP4CACAOAAD_AgAgvQEBAPgCACG-AQEA-AIAIb8BAQD4AgAhwAEBAPwCACHBAQIA-QIAIcMBAAD6AsMBIsQBAQD4AgAhxQFAAPsCACHGAUAA-wIAIQMAAAALACAeAACtBQAgHwAAtwUAIBIAAAALACAFAADGAwAgCAAA-AMAIAsAAMcDACAXAAC3BQAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIQBQAAxgMAIAgAAPgDACALAADHAwAgvQEBAPgCACHDAQAAxAPrASLFAUAA-wIAIcYBQAD7AgAh1QEBAPwCACHWAQEA_AIAIdsBAgD5AgAh3QEBAPgCACHjAQEA-AIAIeQBIADBAwAh5gEAAMID5gEi5wEBAPgCACHpAQAAwwPpASIDAAAANAAgHgAArwUAIB8AALoFACATAAAANAAgBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBEAAKIEACAXAAC6BQAgvQEBAPgCACHDAQAAnASBAiLFAUAA-wIAIcYBQAD7AgAh1gEBAPwCACHiAQEA-AIAIewBAQD4AgAh-wEBAPgCACH8ASAAwQMAIf0BAQD8AgAh_wEAAJsE_wEigQIgAMEDACERBAAAnQQAIAUAAJ4EACAIAACgBAAgDQAAnwQAIBEAAKIEACC9AQEA-AIAIcMBAACcBIECIsUBQAD7AgAhxgFAAPsCACHWAQEA_AIAIeIBAQD4AgAh7AEBAPgCACH7AQEA-AIAIfwBIADBAwAh_QEBAPwCACH_AQAAmwT_ASKBAiAAwQMAIQcEBgIFCgMIKAUMAA8NJgYQKQoRLQ4BAwABAwMAAQYOBAwADQUFAAMIAAULGwcMAAwQHwoEAwABBg8EDAAJDRMGBAcAAQgABQsXBwwACAIJAAQKAAYBCxgAAgYZAA0aAAUHAAEJAAQMAAsOIAoPIQoBDyIAAgsjABAkAAEGJQABAwABBQQuAAUvAA0wABAxABEyAAAAAAMMABQkABUlABYAAAADDAAUJAAVJQAWAQMAAQEDAAEDDAAbJAAcJQAdAAAAAwwAGyQAHCUAHQEDAAEBAwABAwwAIiQAIyUAJAAAAAMMACIkACMlACQAAAADDAAqJAArJQAsAAAAAwwAKiQAKyUALAEDAAEBAwABAwwAMSQAMiUAMwAAAAMMADEkADIlADMCBQADCAAFAgUAAwgABQUMADgkADslADx2ADl3ADoAAAAAAAUMADgkADslADx2ADl3ADoCBwABCAAFAgcAAQgABQUMAEEkAEQlAEV2AEJ3AEMAAAAAAAUMAEEkAEQlAEV2AEJ3AEMCCQAECgAGAgkABAoABgUMAEokAE0lAE52AEt3AEwAAAAAAAUMAEokAE0lAE52AEt3AEwBAwABAQMAAQMMAFMkAFQlAFUAAAADDABTJABUJQBVAwcAAQkABA6JAgoDBwABCQAEDo8CCgUMAFokAF0lAF52AFt3AFwAAAAAAAUMAFokAF0lAF52AFt3AFwSAgETMwEUNgEVNwEWOAEYOgEZPBAaPREbPwEcQRAdQhIgQwEhRAEiRRAmSBMnSRcoSg4pSw4qTA4rTQ4sTg4tUA4uUhAvUxgwVQ4xVxAyWBkzWQ40Wg41WxA2Xho3Xx44YAI5YQI6YgI7YwI8ZAI9ZgI-aBA_aR9AawJBbRBCbiBDbwJEcAJFcRBGdCFHdSVIdyZJeCZKeyZLfCZMfSZNfyZOgQEQT4IBJ1CEASZRhgEQUocBKFOIASZUiQEmVYoBEFaNASlXjgEtWI8BA1mQAQNakQEDW5IBA1yTAQNdlQEDXpcBEF-YAS5gmgEDYZwBEGKdAS9jngEDZJ8BA2WgARBmowEwZ6QBNGilAQRppgEEaqcBBGuoAQRsqQEEbasBBG6tARBvrgE1cLABBHGyARByswE2c7QBBHS1AQR1tgEQeLkBN3m6AT16uwEGe7wBBny9AQZ9vgEGfr8BBn_BAQaAAcMBEIEBxAE-ggHGAQaDAcgBEIQByQE_hQHKAQaGAcsBBocBzAEQiAHPAUCJAdABRooB0QEHiwHSAQeMAdMBB40B1AEHjgHVAQePAdcBB5AB2QEQkQHaAUeSAdwBB5MB3gEQlAHfAUiVAeABB5YB4QEHlwHiARCYAeUBSZkB5gFPmgHoAQWbAekBBZwB6wEFnQHsAQWeAe0BBZ8B7wEFoAHxARChAfIBUKIB9AEFowH2ARCkAfcBUaUB-AEFpgH5AQWnAfoBEKgB_QFSqQH-AVaqAf8BCqsBgAIKrAGBAgqtAYICCq4BgwIKrwGFAgqwAYcCELEBiAJXsgGLAgqzAY0CELQBjgJYtQGQAgq2AZECCrcBkgIQuAGVAlm5AZYCXw"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MealScalarFieldEnum: () => MealScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  OrderitemScalarFieldEnum: () => OrderitemScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProviderProfileScalarFieldEnum: () => ProviderProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.5.0",
  engine: "280c870be64f457428992c43c1f6d557fab6e29e"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Category: "Category",
  Meal: "Meal",
  Order: "Order",
  Orderitem: "Orderitem",
  ProviderProfile: "ProviderProfile",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  bgimage: "bgimage",
  phone: "phone",
  role: "role",
  status: "status",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  adminId: "adminId",
  name: "name",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MealScalarFieldEnum = {
  id: "id",
  meals_name: "meals_name",
  description: "description",
  image: "image",
  price: "price",
  isAvailable: "isAvailable",
  dietaryPreference: "dietaryPreference",
  providerId: "providerId",
  category_name: "category_name",
  cuisine: "cuisine",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  providerId: "providerId",
  first_name: "first_name",
  last_name: "last_name",
  status: "status",
  totalPrice: "totalPrice",
  phone: "phone",
  address: "address",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderitemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  price: "price",
  quantity: "quantity",
  mealId: "mealId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProviderProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  restaurantName: "restaurantName",
  address: "address",
  description: "description",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  customerId: "customerId",
  mealId: "mealId",
  parentId: "parentId",
  rating: "rating",
  status: "status",
  comment: "comment",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app.ts
import express from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer } from "better-auth/plugins";
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: ["Customer", "Provider", "Admin"],
        required: false,
        defaultValue: "Customer"
      },
      status: {
        type: ["activate", "suspend"],
        required: false,
        defaultValue: "activate"
      },
      phone: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true
      },
      bgimage: {
        type: "string",
        required: false,
        defaultValue: true
      }
    }
  },
  plugins: [
    bearer()
  ],
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
    // requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  }
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //7d
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    //1 day
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/modules/auth/auth.service.ts
import status from "http-status";
var getCurrentUser = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      provider: true
    }
  });
};
var signoutUser = async (id, sessionToken) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return {
    success: true,
    message: `current user signout successfully`,
    result
  };
};
var signup = async (data) => {
  const result = await auth.api.signUpEmail({
    body: {
      name: data.name,
      // required
      email: data.email,
      // required
      password: data.password,
      // required
      image: data.image,
      phone: data.phone,
      bgimage: data.bgimage,
      role: data.role
    }
  });
  if (data.role === "Provider") {
    await prisma.providerProfile.create({
      data: {
        userId: result.user.id,
        restaurantName: data.restaurantName,
        address: data.address,
        description: data.description
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  return {
    ...result.user,
    token: result.token,
    accessToken,
    refreshToken
  };
};
var signin = async (data) => {
  const existingUesr = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });
  if (!existingUesr) {
    throw new AppError_default(404, "user not found");
  }
  const result = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password
    }
  });
  if (result.user.status === "suspend") {
    throw new AppError_default(status.UNAUTHORIZED, "User is suspend");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    role: result.user.role,
    name: result.user.name,
    email: result.user.email,
    status: result.user.status,
    emailVerified: result.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success && verifiedRefreshToken.error) {
    throw new AppError_default(status.UNAUTHORIZED, "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    role: data.role,
    name: data.name,
    email: data.email,
    status: data.status,
    emailVerified: data.emailVerified
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var authService = {
  getCurrentUser,
  signoutUser,
  signup,
  signin,
  getNewToken
};

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Something went wrong";
      res.status(statusCode).json({
        success: false,
        message,
        error: error.data
      });
    }
  };
};

// src/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/modules/auth/auth.controller.ts
import status2 from "http-status";
var getCurrentUser2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.getCurrentUser(user.id);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "retrieve current user successsfully",
    data: result
  });
});
var signoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await authService.signoutUser(user.id, betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  CookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var signup2 = catchAsync(async (req, res) => {
  const result = await authService.signup(req.body);
  if (!result) {
    return res.status(400).json({ success: false, message: "Signup failed" });
  }
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.CREATED,
    success: true,
    message: "user signup successfully",
    data: result
  });
});
var signin2 = catchAsync(async (req, res) => {
  const result = await authService.signin(req.body);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status2.OK,
    success: true,
    message: "user signin successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies["better-auth.session_token"];
    if (!refreshToken) {
      throw new AppError_default(status2.UNAUTHORIZED, "Refresh token is missing");
    }
    const result = await authService.getNewToken(refreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "New tokens generated successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        sessionToken
      }
    });
  }
);
var authController = {
  getCurrentUser: getCurrentUser2,
  signoutUser: signoutUser2,
  signup: signup2,
  signin: signin2,
  getNewToken: getNewToken2
};

// src/middleware/auth.ts
import status3 from "http-status";
var auth2 = (roles) => {
  return async (req, res, next) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token"
      );
      if (!sessionToken) {
        throw new AppError_default(
          status3.UNAUTHORIZED,
          "Unauthorized access! No session token provided."
        );
      }
      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: /* @__PURE__ */ new Date()
            }
          },
          include: {
            user: true
          }
        });
        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;
          const now = /* @__PURE__ */ new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);
          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = timeRemaining / sessionLifeTime * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
            console.log("Session Expiring Soon!!");
          }
          if (user.status === "suspend") {
            throw new AppError_default(
              status3.UNAUTHORIZED,
              "Unauthorized access! User is not active."
            );
          }
          if (roles.length > 0 && !roles.includes(user.role)) {
            throw new AppError_default(
              status3.FORBIDDEN,
              "Forbidden access! You do not have permission to access this resource."
            );
          }
          req.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            emailVerified: user.emailVerified,
            isActive: user.isActive,
            name: user.name,
            status: user.status
          };
        }
        const accessToken2 = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken2) {
          throw new AppError_default(
            status3.UNAUTHORIZED,
            "Unauthorized access! No access token provided."
          );
        }
      }
      const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! No access token provided.");
      }
      const verifiedToken = jwtUtils.verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
      if (!verifiedToken.success) {
        throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
      }
      if (roles.length > 0 && !roles.includes(verifiedToken.data.role)) {
        throw new AppError_default(status3.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
      }
      next();
    } catch (error) {
      throw new AppError_default(status3.BAD_REQUEST, error.message);
    }
  };
};
var auth_default = auth2;

// src/middleware/auth.const.ts
var UserRoles = {
  Admin: "Admin",
  Customer: "Customer",
  Provider: "Provider"
};

// src/modules/auth/auth.route.ts
var router = Router();
router.get("/me", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.getCurrentUser);
router.post("/logout", auth_default([UserRoles.Admin, UserRoles.Customer, UserRoles.Provider]), authController.signoutUser);
router.post("/register", authController.signup);
router.post("/login", authController.signin);
router.post("/refresh-token", authController.getNewToken);
var authRouter = { router };

// src/modules/meal/meal.route.ts
import { Router as Router2 } from "express";

// src/modules/meal/meal.service.ts
import status4 from "http-status";
var createMeal = async (data, userid) => {
  const providerid = await prisma.user.findUnique({
    where: { id: userid },
    include: { provider: { select: { id: true } } }
  });
  if (!providerid) {
    throw new AppError_default(status4.NOT_FOUND, "provider not found");
  }
  const categoryCheck = await prisma.category.findUnique({
    where: {
      name: data.category_name
    }
  });
  if (!categoryCheck) {
    throw new AppError_default(status4.NOT_FOUND, "category not found");
  }
  const result = await prisma.meal.create({
    data: {
      ...data,
      providerId: providerid.provider.id
    }
  });
  return result;
};
var getAllmeals = async (data, isAvailable, page, limit, skip, sortBy, sortOrder) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (data.meals_name) {
      orConditions.push({
        meals_name: {
          contains: data.meals_name,
          mode: "insensitive"
        }
      });
    }
    if (data.description) {
      orConditions.push({
        description: {
          contains: data.description,
          mode: "insensitive"
        }
      });
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
    if (orConditions.length > 0) {
      andConditions.push({ OR: orConditions });
    }
  }
  if (typeof isAvailable === "boolean") {
    andConditions.push({ isAvailable });
  }
  if (data.price) {
    andConditions.push({
      price: {
        gte: 1,
        lte: Number(data.price)
      }
    });
  }
  if (data.dietaryPreference?.length) {
    const dietaryList = data.dietaryPreference.split(
      ","
    );
    andConditions.push({
      OR: dietaryList.map((item) => ({ dietaryPreference: item }))
    });
  }
  const meals = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED"
    },
    include: {
      provider: true,
      reviews: {
        where: {
          parentId: null,
          rating: { gt: 0 },
          status: "APPROVED"
        },
        include: {
          customer: true
        }
      }
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const mealsWithStats = meals.map((meal) => {
    const stats = reviewStats.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      averageRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReview: stats?._count?.rating || 0
      // Default to 0
    };
  });
  const total = await prisma.meal.count({ where: { AND: andConditions } });
  return {
    data: mealsWithStats,
    pagination: {
      total,
      page,
      limit,
      totalpage: Math.ceil(total / limit) || 1
    }
  };
};
var getSinglemeals = async (id) => {
  const result = await prisma.meal.findUniqueOrThrow({
    where: {
      id,
      status: "APPROVED"
    },
    include: {
      category: true,
      provider: {
        include: {
          user: true
        }
      },
      reviews: {
        where: {
          parentId: null
        },
        include: {
          replies: {
            include: {
              customer: true,
              replies: true
            }
          },
          customer: {
            include: {
              reviews: true
            }
          }
        }
      }
    }
  });
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: result.provider.userId
        }
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    ...result,
    providerRating: {
      totalReview: totalReview ?? 0,
      averageRating: averageRating ?? 0
    }
  };
};
var UpdateMeals = async (data, mealid) => {
  const { category_name } = data;
  const existmeal = await prisma.meal.findUnique({
    where: { id: mealid }
  });
  if (!existmeal) {
    throw new AppError_default(status4.NOT_FOUND, "meals not found");
  }
  if (existmeal.category_name === category_name) {
    throw new AppError_default(status4.CONFLICT, "category_name is already up to date.");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      ...data
    }
  });
  return result;
};
var DeleteMeals = async (mealid) => {
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (!existmeal) {
    throw new AppError_default(status4.NOT_FOUND, "meal not found");
  }
  const result = await prisma.meal.delete({
    where: {
      id: mealid
    }
  });
  console.log(result, "result");
  return result;
};
var getOwnMeals = async (userid) => {
  const meals = await prisma.meal.findMany({
    where: {
      provider: {
        userId: userid
      }
    },
    include: {
      category: true,
      provider: true,
      reviews: {
        where: {
          parentId: null
        },
        include: {
          replies: {
            include: {
              replies: true
            }
          }
        }
      }
    }
  });
  const mealIds = meals.map((meal) => meal.id);
  const reviewStats = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      mealId: { in: mealIds },
      parentId: null,
      rating: { gt: 0 },
      status: "APPROVED"
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const mealsWithStats = meals.map((meal) => {
    const stats = reviewStats.find((s) => s.mealId === meal.id);
    return {
      ...meal,
      averageRating: stats?._avg?.rating || 0,
      // Default to 0
      totalReview: stats?._count?.rating || 0
      // Default to 0
    };
  });
  return mealsWithStats;
};
var updateStatus = async (data, mealid) => {
  const { status: status16 } = data;
  const existmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (existmeal?.status === status16) {
    throw new AppError_default(409, "meal status already up to date");
  }
  if (existmeal?.id !== mealid) {
    throw new AppError_default(404, "mealid is invalid,please check your mealid");
  }
  const result = await prisma.meal.update({
    where: {
      id: mealid
    },
    data: {
      status: status16
    }
  });
  return result;
};
var getAllMealsForAdmin = async (data, page, limit, skip, sortBy, sortOrder) => {
  const andConditions = [];
  if (data) {
    const orConditions = [];
    if (data.meals_name) {
      orConditions.push({
        meals_name: {
          contains: data.meals_name,
          mode: "insensitive"
        }
      });
    }
    if (data.description) {
      orConditions.push({
        description: {
          contains: data.description,
          mode: "insensitive"
        }
      });
    }
    if (data.cuisine) {
      orConditions.push({
        cuisine: {
          equals: data.cuisine
        }
      });
    }
    if (data.category_name) {
      orConditions.push({
        category_name: {
          contains: data.category_name,
          mode: "insensitive"
        }
      });
    }
  }
  const result = await prisma.meal.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
      status: "APPROVED"
    },
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  return result;
};
var mealService = {
  createMeal,
  UpdateMeals,
  DeleteMeals,
  getAllmeals,
  getSinglemeals,
  getOwnMeals,
  updateStatus,
  getAllMealsForAdmin
};

// src/helpers/paginationHelping.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 9;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationHelping_default = paginationSortingHelper;

// src/modules/meal/meal.controller.ts
import status5 from "http-status";
var createMeal2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.createMeal(req.body, user.id);
  sendResponse(res, {
    httpStatusCode: status5.CREATED,
    success: true,
    message: "your meal has been created",
    data: result
  });
});
var UpdateMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are not authorized" });
  }
  const result = await mealService.UpdateMeals(req.body, req.params.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "meal update successfully",
    data: result
  });
});
var DeleteMeals2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({
      success: false,
      message: "you are unauthorized"
    });
  }
  const result = await mealService.DeleteMeals(req.params.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "your meal delete has been successfully",
    data: result
  });
});
var Getallmeals = catchAsync(async (req, res) => {
  const isAvailable = req.query.isAvailable ? req.query.isAvailable === "true" ? true : req.query.isAvailable == "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await mealService.getAllmeals(req.query, isAvailable, page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: " retrieve all meals successfully",
    data: result
  });
});
var getAllMealsForAdmin2 = catchAsync(async (req, res, next) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(req.query);
  const result = await mealService.getAllMealsForAdmin(req.query, page, limit, skip, sortBy, sortOrder);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: " retrieve all meals for admin successfully",
    data: result
  });
});
var GetSignlemeals = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await mealService.getSinglemeals(id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: " retrieve single meal successfully",
    data: result
  });
});
var getownmeals = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await mealService.getOwnMeals(user.id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "your own meal retrieve has been successfully",
    data: result
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  console.log(req.body, "req,body");
  const user = req.user;
  if (!user) {
    return res.status(status5.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const { id } = req.params;
  const result = await mealService.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status5.OK,
    success: true,
    message: "meal status update successfully",
    data: result
  });
});
var mealController = {
  createMeal: createMeal2,
  UpdateMeals: UpdateMeals2,
  DeleteMeals: DeleteMeals2,
  Getallmeals,
  GetSignlemeals,
  getownmeals,
  updateStatus: updateStatus2,
  getAllMealsForAdmin: getAllMealsForAdmin2
};

// src/utils/handleZodError.ts
var formatZodIssues = (error) => {
  return error.issues.map((e) => {
    let message = "";
    switch (e.code) {
      case "invalid_type":
        message = `field ${e.path.join(", ") || "unknown"} expected ${e.expected} type,but  received ${e.input},please provide a valid type`;
        break;
      case "unrecognized_keys":
        message = `You provided extra fields: ${e.keys || "unknown"}. Please remove keys ${e.keys}`;
        break;
      case "invalid_format":
        message = `field ${e.path.join(",") || "unknown"} is not a valid format(${e.format}) but received ${e.input},please prrovide a valid format`;
        break;
      case "invalid_value":
        message = `Invalid value. Allowed values are (${e.values}) but received ${e.input},plese provide a currect value`;
        break;
      case "too_big":
        message = `field  ${e.path} provide a big data,received ${e.input},please provide a valid value`;
        break;
      case "too_small":
        message = `field  ${e.path} provide a small data,received ${e.input},please provide a valid value`;
        break;
      default:
        message = `field ${e.path} is invalid data,received ${e.input}`;
    }
    return {
      message
    };
  });
};

// src/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const parsedResult = zodSchema.safeParse(req.body);
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON in data field"
        });
      }
    }
    if (!parsedResult.success) {
      const zodmessage = formatZodIssues(parsedResult.error);
      return res.status(400).json({
        success: false,
        message: "your provided data is invalid",
        zodmessage
      });
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/modules/meal/meal.validation.ts
import z from "zod";
var CreatemealData = z.object({
  meals_name: z.string(),
  description: z.string().optional(),
  image: z.string(),
  price: z.number(),
  isAvailable: z.boolean().optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).default("VEGETARIAN"),
  category_name: z.string(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).default("BANGLEDESHI")
}).strict();
var UpdatemealData = z.object({
  meals_name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  isAvailable: z.boolean().optional(),
  category_name: z.string().optional(),
  cuisine: z.enum([
    "BANGLEDESHI",
    "ITALIAN",
    "CHINESE",
    "INDIAN",
    "MEXICAN",
    "THAI",
    "JAPANESE",
    "FRENCH",
    "MEDITERRANEAN",
    "AMERICAN",
    "MIDDLE_EASTERN"
  ]).optional(),
  dietaryPreference: z.enum([
    "HALAL",
    "VEGAN",
    "VEGETARIAN",
    "ANY",
    "GLUTEN_FREE",
    "KETO",
    "PALEO",
    "DAIRY_FREE",
    "NUT_FREE",
    "LOW_SUGAR"
  ]).optional()
});
var mealQuerySchema = z.object({
  data: z.object({
    meals_name: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    // Coerce handles strings from forms/URLs
    dietaryPreference: z.string().optional(),
    cuisine: z.string().optional(),
    category_name: z.string().optional()
  })
});
var mealupdateStatus = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

// src/modules/meal/meal.route.ts
var router2 = Router2();
router2.get("/meals", mealController.Getallmeals);
router2.get("/admin/meals", auth_default([UserRoles.Admin]), mealController.getAllMealsForAdmin);
router2.get("/provider/meals/own", auth_default([UserRoles.Provider]), mealController.getownmeals);
router2.post("/provider/meal", auth_default([UserRoles.Provider]), validateRequest(CreatemealData), mealController.createMeal);
router2.delete("/provider/meal/:id", auth_default([UserRoles.Provider, UserRoles.Admin]), mealController.DeleteMeals);
router2.put("/provider/meal/:id", auth_default([UserRoles.Provider]), validateRequest(UpdatemealData), mealController.UpdateMeals);
router2.get("/meal/:id", mealController.GetSignlemeals);
router2.put("/admin/meal/:id", auth_default([UserRoles.Admin]), mealController.updateStatus);
var mealRouter = { router: router2 };

// src/middleware/notFound.ts
function Notfound(req, res) {
  res.status(404).json({ message: "route not found" });
}

// src/modules/provider/provider.route.ts
import { Router as Router3 } from "express";

// src/modules/provider/provider.service.ts
import status6 from "http-status";
var createProvider = async (data, userId) => {
  const existinguser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existinguser) {
    throw new AppError_default(404, "user not found");
  }
  const result = await prisma.providerProfile.create({
    data: {
      restaurantName: data.restaurantName,
      address: data.address,
      description: data.description,
      image: data.image,
      userId
    }
  });
  return result;
};
var getAllProvider = async () => {
  const providers = await prisma.providerProfile.findMany({
    include: {
      user: true,
      meals: {
        include: {
          reviews: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  let i = 0;
  const userid = providers.map((p) => p.userId);
  console.log(userid.length, "userid");
  for (i = 0; i < userid.length; i++) {
    console.log(userid.length, "leng");
    console.log(i, "idss");
    const ratings = await prisma.review.aggregate({
      where: {
        rating: {
          gt: 0
        },
        parentId: null,
        meal: {
          provider: {
            userId: userid[i]
          }
        }
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });
    console.log(i, "id");
    console.log(userid[i], "ratingdata");
    const providerWithRating = providers.map((provider) => {
      const totalReview = ratings._count.rating;
      const averageRating = ratings._avg.rating;
      return {
        ...provider,
        rating: {
          totalReview,
          averageRating
        }
      };
    });
    return providerWithRating;
  }
};
var getProviderWithMeals = async (id) => {
  const existprovider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  if (!existprovider) {
    throw new AppError_default(status6.NOT_FOUND, "provider not found for this id");
  }
  const provider = await prisma.providerProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          reviews: true
        }
      },
      meals: {
        include: { category: true, reviews: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!provider) {
    throw new AppError_default(status6.NOT_FOUND, "provider not found for this id");
  }
  const userid = provider.userId;
  const ratings = await prisma.review.groupBy({
    by: ["mealId"],
    where: {
      rating: {
        gt: 0
      },
      parentId: null,
      meal: {
        provider: {
          userId: userid
        }
      }
    },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  const totalReview = ratings.reduce((sum, r) => sum + r._count.rating, 0);
  const totalRating = ratings.reduce(
    (sum, r) => sum + (r._avg.rating ?? 0) * r._count.rating,
    0
  );
  const averageRating = totalReview > 0 ? totalRating / totalReview : 0;
  return {
    result: {
      ...provider,
      totalReview: totalReview || 0,
      averageRating: Number(averageRating.toFixed(1)) || 0
    }
  };
};
var UpateProviderProfile = async (data, userid) => {
  if (!data) {
    throw new AppError_default(status6.BAD_REQUEST, "no data provided for update");
  }
  const providerinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      provider: true
    }
  });
  if (!providerinfo) {
    throw new AppError_default(status6.NOT_FOUND, "user not found");
  }
  const result = await prisma.providerProfile.update({
    where: { id: providerinfo.provider.id },
    data: {
      restaurantName: data.restaurantName,
      image: data.image,
      description: data.description,
      address: data.address
    }
  });
  return result;
};
var providerService = {
  createProvider,
  getAllProvider,
  getProviderWithMeals,
  UpateProviderProfile
};

// src/modules/provider/provider.controller.ts
import status7 from "http-status";
var createProvider2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await providerService.createProvider(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status7.CREATED,
      success: true,
      message: "your provider profile has been created",
      data: result
    });
  }
);
var gelAllprovider = catchAsync(
  async (req, res) => {
    const result = await providerService.getAllProvider();
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "retrieve all provider successfully",
      data: result
    });
  }
);
var getProviderWithMeals2 = catchAsync(
  async (req, res) => {
    const result = await providerService.getProviderWithMeals(req.params.id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "retrieve provider with meals successfully",
      data: result
    });
  }
);
var UpateProviderProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await providerService.UpateProviderProfile(req.body, user.id);
  if (!result) {
    sendResponse(res, {
      httpStatusCode: status7.BAD_REQUEST,
      success: false,
      message: "update provider profile failed",
      data: result
    });
  }
  sendResponse(res, {
    httpStatusCode: status7.OK,
    success: true,
    message: "update provider profile successfully",
    data: result
  });
});
var providerController = { createProvider: createProvider2, gelAllprovider, getProviderWithMeals: getProviderWithMeals2, UpateProviderProfile: UpateProviderProfile2 };

// src/modules/provider/provider.validation.ts
import z2 from "zod";
var CreateproviderData = z2.object({
  restaurantName: z2.string(),
  address: z2.string(),
  description: z2.string().optional(),
  image: z2.string().optional()
}).strict();
var UpdateproviderData = z2.object({
  restaurantName: z2.string().optional(),
  address: z2.string().optional(),
  description: z2.string().optional(),
  image: z2.string().min(8).optional()
}).strict();

// src/modules/provider/provider.route.ts
var router3 = Router3();
router3.post("/provider/profile", auth_default([UserRoles.Provider]), validateRequest(CreateproviderData), providerController.createProvider);
router3.put("/providers/update", auth_default([UserRoles.Provider]), validateRequest(UpdateproviderData), providerController.UpateProviderProfile);
router3.get("/providers", providerController.gelAllprovider);
router3.get("/providers/:id", providerController.getProviderWithMeals);
var providerRouter = { router: router3 };

// src/modules/order/order.route.ts
import { Router as Router4 } from "express";

// src/modules/order/order.service.ts
import status8 from "http-status";
var CreateOrder = async (payload, customerId) => {
  const mealId = payload.items.find((i) => i.mealId);
  const existingmeals = await prisma.meal.findMany({
    where: {
      id: mealId?.mealId
    }
  });
  const mealdata = existingmeals.find((meal) => meal.id == mealId?.mealId);
  const orderexisting = await prisma.order.findMany({
    where: {
      customerId,
      orderitem: {
        some: {
          mealId: mealId?.mealId
        }
      }
    }
  });
  const existingOrder = orderexisting.filter((item, index) => item.status == "PLACED");
  try {
    const result = await prisma.order.create({
      data: {
        customerId,
        providerId: mealdata.providerId,
        address: payload.address,
        phone: payload.phone,
        first_name: payload.first_name,
        last_name: payload.last_name,
        orderitem: {
          createMany: {
            data: payload.items.map((item) => ({
              mealId: item.mealId,
              price: mealdata.price,
              quantity: item.quantity
            }))
          }
        },
        totalPrice: mealdata.price * payload.items.reduce((acc, item) => acc + item.quantity, 0) || 0
      },
      include: {
        orderitem: {
          include: {
            meal: {
              select: {
                meals_name: true,
                cuisine: true,
                price: true
              }
            }
          }
        },
        provider: true
      }
    });
    if (result.orderitem.length == 0) {
      await prisma.order.delete({
        where: {
          id: result.id
        }
      });
      throw new AppError_default(400, "order created failed");
    }
    return result;
  } catch (error) {
    throw new AppError_default(500, "something went wrong,please try again");
  }
};
var getOwnmealsOrder = async (userid) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userid },
    include: { provider: true }
  });
  if (existingUser?.role == "Customer") {
    const result = await prisma.order.findMany({
      where: {
        customerId: userid
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result
    };
  }
  if (existingUser?.role == "Provider") {
    const result = await prisma.order.findMany({
      where: {
        providerId: existingUser.provider?.id
      },
      include: {
        orderitem: {
          include: {
            meal: true
          }
        }
      }
    });
    return {
      success: true,
      message: `your own meals orders retrieve successfully`,
      result
    };
  }
};
var UpdateOrderStatus = async (id, data, role) => {
  const { status: status16 } = data;
  const statusValue = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED"
  ];
  if (!statusValue.includes(status16)) {
    throw new AppError_default(400, "invalid status value");
  }
  const existingOrder = await prisma.order.findUnique({ where: { id } });
  if (!existingOrder) {
    throw new AppError_default(404, "no order found for this id");
  }
  if (existingOrder?.status == status16) {
    throw new AppError_default(409, `order already ${status16}`);
  }
  if (role == "Customer" && status16 !== "CANCELLED") {
    throw new AppError_default(400, "Customer can only change status to CANCELLED");
  }
  if (role == "Customer" && status16 == "CANCELLED") {
    if (existingOrder?.status == "DELIVERED" || existingOrder?.status == "PREPARING" || existingOrder?.status == "READY") {
      throw new AppError_default(
        400,
        `you can't cancel order when order status is ${existingOrder.status}`
      );
    }
    const result = await prisma.order.update({
      where: {
        id
      },
      data: {
        status: status16
      }
    });
    return result;
  }
  if (role == "Provider" && status16 === "CANCELLED") {
    return "CANCELLED only Customer Change";
  }
  if (role == "Provider") {
    if (status16 == "PLACED" || status16 == "PREPARING" || status16 == "READY" || status16 == "DELIVERED") {
      const result = await prisma.order.update({
        where: {
          id
        },
        data: {
          status: status16
        }
      });
      return {
        success: true,
        message: `update order status successfully`,
        result
      };
    }
  }
};
var getAllorder = async (role) => {
  if (role !== "Admin") {
    return "view all order only Admin";
  }
  const result = await prisma.order.findMany({
    include: {
      orderitem: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var customerOrderStatusTrack = async (mealid, userid) => {
  const existingOrder = await prisma.order.findMany({
    where: {
      customerId: userid,
      orderitem: {
        some: {
          mealId: mealid
        }
      }
    }
  });
  if (existingOrder.length === 0) {
    throw new AppError_default(status8.NOT_FOUND, "no order found for this meal");
  }
  console.log(existingOrder, "data");
  return {
    success: true,
    message: `customer order status track successfully`,
    result: existingOrder
  };
};
var CustomerRunningAndOldOrder = async (userid, status16) => {
  const andConditions = [];
  let message = "customer running and old order retrieve successfully";
  let currentStatus = status16;
  if (status16 == "DELIVERED") {
    andConditions.push({ status: status16 });
    message = "Recent order information retrieved successfully.", currentStatus = status16;
  }
  if (status16 == "CANCELLED") {
    andConditions.push({ status: status16 });
    message = "CANCELLED order information retrieved successfully.", currentStatus = status16;
  }
  if (status16 == "PLACED" || status16 == "PREPARING" || status16 == "READY") {
    andConditions.push({ status: status16 });
    message = "running order retrieved successfully.", currentStatus = status16;
  }
  const result = await prisma.order.findMany({
    where: {
      customerId: userid,
      AND: andConditions
    },
    include: {
      orderitem: { orderBy: { createdAt: "desc" } }
    }
  });
  return {
    success: true,
    message,
    result
  };
};
var getSingleOrder = async (id) => {
  const result = await prisma.order.findUnique({
    where: { id },
    include: {
      orderitem: {
        select: {
          meal: true,
          orderId: true,
          price: true,
          quantity: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });
  if (!result) {
    throw new AppError_default(status8.NOT_FOUND, "no order found for this id");
  }
  return {
    success: true,
    message: `single order retrieve successfully`,
    result
  };
};
var ServiceOrder = {
  CreateOrder,
  getOwnmealsOrder,
  UpdateOrderStatus,
  getAllorder,
  customerOrderStatusTrack,
  CustomerRunningAndOldOrder,
  getSingleOrder
};

// src/modules/order/order.controller.ts
import status9 from "http-status";
var createOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CreateOrder(req.body, user.id);
    sendResponse(res, {
      httpStatusCode: status9.CREATED,
      success: true,
      message: "your order has been created successfully",
      data: result
    });
  }
);
var getOwnmealsOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getOwnmealsOrder(user.id);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: result?.success,
    message: result?.message,
    data: result?.result
  });
});
var UpdateOrderStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.UpdateOrderStatus(req.params.id, req.body, user.role);
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "update order status successfully",
      data: result
    });
  }
);
var getAllOrder = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.getAllorder(user.role);
    if (!result) {
      sendResponse(res, {
        httpStatusCode: status9.BAD_REQUEST,
        success: false,
        message: "retrieve all orders failed",
        data: result
      });
    }
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "retrieve all orders successfully",
      data: result
    });
  }
);
var customerOrderStatusTrack2 = catchAsync(
  async (req, res) => {
    const users = req.user;
    if (!users) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.customerOrderStatusTrack(req.params.id, users.id);
    if (!result?.success) {
      sendResponse(res, {
        httpStatusCode: status9.BAD_REQUEST,
        success: false,
        message: result?.message,
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: "customer order status track successfully",
      data: result?.result
    });
  }
);
var CustomerRunningAndOldOrder2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status9.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await ServiceOrder.CustomerRunningAndOldOrder(user.id, req.query.status);
    if (!result.success) {
      sendResponse(res, {
        httpStatusCode: status9.BAD_REQUEST,
        success: false,
        message: "customer order status track failed",
        data: result?.result
      });
    }
    sendResponse(res, {
      httpStatusCode: status9.OK,
      success: true,
      message: result.message,
      data: result?.result
    });
  }
);
var getSingleOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ServiceOrder.getSingleOrder(req.params.id);
  if (!result.success) {
    sendResponse(res, {
      httpStatusCode: status9.BAD_REQUEST,
      success: false,
      message: "retrieve single order failed",
      data: result?.result
    });
  }
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "retrieve single order successfully",
    data: result?.result
  });
});
var OrderController = {
  createOrder,
  getOwnmealsOrder: getOwnmealsOrder2,
  UpdateOrderStatus: UpdateOrderStatus2,
  getAllOrder,
  customerOrderStatusTrack: customerOrderStatusTrack2,
  CustomerRunningAndOldOrder: CustomerRunningAndOldOrder2,
  getSingleOrder: getSingleOrder2
};

// src/modules/order/order.validation.ts
import z3 from "zod";
var CreateorderData = z3.object({
  first_name: z3.string().optional(),
  last_name: z3.string().optional(),
  phone: z3.string().min(11).max(14),
  address: z3.string().min(1),
  items: z3.array(
    z3.object({
      mealId: z3.string(),
      quantity: z3.number().min(1)
    })
  ).min(1)
});

// src/modules/order/order.route.ts
var router4 = Router4();
router4.post("/orders", auth_default([UserRoles.Customer]), validateRequest(CreateorderData), OrderController.createOrder);
router4.get("/orders/meal/:id/status", auth_default([UserRoles.Customer]), OrderController.customerOrderStatusTrack);
router4.get("/myorders/status", auth_default([UserRoles.Customer]), OrderController.CustomerRunningAndOldOrder);
router4.get("/orders/all", auth_default([UserRoles.Admin]), OrderController.getAllOrder);
router4.get("/orders", auth_default([UserRoles.Customer, UserRoles.Provider]), OrderController.getOwnmealsOrder);
router4.patch("/provider/orders/:id", auth_default([UserRoles.Provider, UserRoles.Customer]), OrderController.UpdateOrderStatus);
router4.get("/orders/:id", auth_default([UserRoles.Customer]), OrderController.getSingleOrder);
var OrderRouter = { router: router4 };

// src/modules/category/category.route.ts
import { Router as Router5 } from "express";

// src/modules/category/category.service.ts
var CreateCategory = async (data, adminId) => {
  const categorydata = await prisma.category.findUnique({
    where: {
      name: data.name
    }
  });
  if (categorydata) {
    throw new AppError_default(409, "Category already exists");
  }
  await prisma.user.findUniqueOrThrow({
    where: { id: adminId }
  });
  const result = await prisma.category.create({
    data: {
      ...data,
      adminId
    }
  });
  return result;
};
var getCategory = async () => {
  const result = await prisma.category.findMany({
    include: {
      meals: {
        where: {
          status: "APPROVED"
        }
      },
      user: true
    },
    orderBy: { name: "desc" }
  });
  return result;
};
var SingleCategory = async (id) => {
  const result = await prisma.category.findFirstOrThrow({
    where: { id },
    include: {
      meals: {
        include: {
          reviews: true
        }
      },
      user: true
    }
  });
  return result;
};
var UpdateCategory = async (id, data) => {
  const { name } = data;
  const existcategory = await prisma.category.findUniqueOrThrow({
    where: { id }
  });
  if (existcategory.name == name) {
    throw new AppError_default(409, "Category name is already up to date.");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      ...data
    }
  });
  return result;
};
var DeleteCategory = async (id) => {
  await prisma.category.findUniqueOrThrow({ where: { id } });
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var categoryService = {
  CreateCategory,
  getCategory,
  UpdateCategory,
  DeleteCategory,
  SingleCategory
};

// src/modules/category/category.controller.ts
import { status as status10 } from "http-status";
var CreateCategory2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status10.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await categoryService.CreateCategory(
      req.body,
      user.id
    );
    sendResponse(res, {
      httpStatusCode: status10.CREATED,
      success: true,
      message: "your category has been created",
      data: result
    });
  }
);
var getCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.getCategory();
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "retrieve category successfully",
    data: result
  });
});
var SingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.SingleCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "retrieve single category successfully",
    data: result
  });
});
var UpdateCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.UpdateCategory(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "your category has beed changed",
    data: result
  });
});
var DeleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryService.DeleteCategory(req.params.id);
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "your category has beed deleted",
    data: result
  });
});
var CategoryController = {
  CreateCategory: CreateCategory2,
  getCategory: getCategory2,
  UpdateCategory: UpdateCategory2,
  DeleteCategory: DeleteCategory2,
  SingleCategory: SingleCategory2
};

// src/modules/category/category.validation.ts
import z4 from "zod";
var createcategoryData = z4.object({
  name: z4.string(),
  image: z4.string()
}).strict();
var UpdatecategoryData = z4.object({
  name: z4.string().optional(),
  image: z4.string().optional()
}).strict();

// src/modules/category/category.route.ts
var router5 = Router5();
router5.post("/admin/category", auth_default([UserRoles.Admin]), validateRequest(createcategoryData), CategoryController.CreateCategory);
router5.get("/category", CategoryController.getCategory);
router5.get("/category/:id", CategoryController.SingleCategory);
router5.put("/admin/category/:id", auth_default([UserRoles.Admin]), validateRequest(UpdatecategoryData), CategoryController.UpdateCategory);
router5.delete("/admin/category/:id", auth_default([UserRoles.Admin]), CategoryController.DeleteCategory);
var CategoryRouter = { router: router5 };

// src/modules/user/user.route.ts
import { Router as Router6 } from "express";

// src/modules/user/user.service.ts
import status11 from "http-status";
var GetAllUsers = async (data) => {
  const andCondition = [];
  if (typeof data.data?.email == "string") {
    andCondition.push({
      email: data.data?.email
    });
  }
  if (typeof data.data?.phone == "string") {
    andCondition.push({
      email: data.data?.phone
    });
  }
  if (typeof data.data?.emailVerified == "boolean") {
    andCondition.push({ emailVerified: data.data?.emailVerified });
  }
  if (typeof data.data?.role == "string") {
    andCondition.push({ role: data.data?.role });
  }
  if (typeof data.data?.status == "string") {
    andCondition.push({ status: data.data?.status });
  }
  if (typeof data.isactivequery == "boolean") {
    andCondition.push({ isActive: data.isactivequery });
  }
  const result = await prisma.user.findMany({
    take: data.limit,
    skip: data.skip,
    where: {
      AND: andCondition
    },
    include: {
      provider: true
    },
    orderBy: {
      [data.sortBy]: data.sortOrder
    }
  });
  const totalusers = await prisma.user.count({
    where: {
      AND: andCondition
    }
  });
  return {
    data: result,
    pagination: {
      totalusers,
      page: data.page,
      limit: data.limit,
      totalpage: Math.ceil(totalusers / data.limit) || 1
    }
  };
};
var getUserprofile = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  if (!user) {
    throw new AppError_default(status11.NOT_FOUND, "user not found for this id");
  }
  if (user.role !== "Provider") {
    return user;
  }
  const providerProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: id
    },
    include: {
      user: {
        include: {
          reviews: {
            where: {
              rating: {
                gt: 0
              },
              parentId: null
            }
          }
        }
      }
    }
  });
  const totalReview = providerProfile?.user.reviews.length;
  const averageRating = totalReview ? providerProfile.user.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReview : 0;
  return {
    ...user,
    providerProfile,
    totalReview: totalReview || 0,
    averageRating: Number(averageRating.toFixed(1)) || 0
  };
};
var UpateUserProfile = async (data, userid) => {
  if (!data) {
    throw new AppError_default(400, "your data isn't found,please provide a information");
  }
  const userinfo = await prisma.user.findUnique({
    where: { id: userid },
    include: {
      accounts: true
    }
  });
  if (!userinfo) {
    throw new AppError_default(404, "user data not found");
  }
  const isCustomer = userinfo.role == "Customer";
  const result = await prisma.user.update({
    where: { id: userid },
    data: {
      name: data.name,
      image: data.image,
      bgimage: data.bgimage,
      phone: data.phone,
      isActive: data.isActive,
      ...isCustomer ? {} : { email: data.email },
      accounts: {
        updateMany: {
          where: { userId: userid },
          data: {
            password: data.password
          }
        }
      }
    }
  });
  return result;
};
var UpdateUser = async (id, data) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  if (userData.role == data.role) {
    throw new AppError_default(409, `your status(${data.role}) already up to date`);
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: data.role,
      status: data.status,
      email: data.email
    }
  });
  return result;
};
var DeleteUserProfile = async (id) => {
  const userData = await prisma.user.findUnique({ where: { id } });
  if (!userData) {
    throw new AppError_default(404, "your user data didn't found");
  }
  const result = await prisma.user.delete({
    where: { id }
  });
  return result;
};
var OwnProfileDelete = async (userid) => {
  console.log(userid);
  const userData = await prisma.user.findUnique({
    where: { id: userid }
  });
  if (!userData) {
    throw new AppError_default(404, "your user data not found");
  }
  const result = await prisma.user.delete({
    where: { id: userid }
  });
  return result;
};
var UserService = {
  GetAllUsers,
  UpdateUser,
  getUserprofile,
  UpateUserProfile,
  DeleteUserProfile,
  OwnProfileDelete
};

// src/modules/user/user.controller.ts
import status12 from "http-status";
var GetAllUsers2 = catchAsync(async (req, res) => {
  const search = req.query;
  const { isActive } = req.query;
  const isactivequery = isActive ? req.params.isActive === "true" ? true : req.query.isActive === "false" ? false : void 0 : void 0;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelping_default(
    req.query
  );
  const result = await UserService.GetAllUsers({
    data: search,
    isactivequery,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  });
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "retrieve all users has been successfully",
    data: result
  });
});
var getUserprofile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(status12.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.getUserprofile(req.params.id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: user.role !== "Provider" ? "your user profile has been retrieved successfully" : "your user profile has been retrieved successfully",
    data: result
  });
});
var UpateUserProfile2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.UpateUserProfile(
    req.body,
    user.id
  );
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "your profile has been updated successfully",
    data: result
  });
});
var UpdateUser2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.UpdateUser(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: `user change successfully`,
      data: result
    });
  }
);
var DeleteUserProfile2 = catchAsync(
  async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await UserService.DeleteUserProfile(req.params.id);
    sendResponse(res, {
      httpStatusCode: status12.OK,
      success: true,
      message: "user account delete successfully",
      data: result
    });
  }
);
var OwnProfileDelete2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await UserService.OwnProfileDelete(user.id);
  sendResponse(res, {
    httpStatusCode: status12.OK,
    success: true,
    message: "user own account delete successfully",
    data: result
  });
});
var UserController = {
  GetAllUsers: GetAllUsers2,
  UpdateUser: UpdateUser2,
  getUserprofile: getUserprofile2,
  UpateUserProfile: UpateUserProfile2,
  DeleteUserProfile: DeleteUserProfile2,
  OwnProfileDelete: OwnProfileDelete2
};

// src/modules/user/user.validation.ts
import z5 from "zod";
var UpdateuserProfileData = z5.object({
  name: z5.string().optional(),
  image: z5.string().optional(),
  bgimage: z5.string().optional(),
  email: z5.string().optional(),
  password: z5.string().min(8).optional(),
  phone: z5.string().min(10).max(15).optional(),
  isActive: z5.boolean().optional()
}).strict();
var UpdateUserCommonData = z5.object({
  role: z5.enum(["Admin", "Customer", "Provider"]).optional(),
  status: z5.enum(["activate", "suspend"]).optional(),
  email: z5.string().optional()
}).strict();

// src/modules/user/user.route.ts
var router6 = Router6();
router6.get("/admin/users", auth_default([UserRoles.Admin]), UserController.GetAllUsers);
router6.put("/user/profile/update", auth_default([UserRoles.Customer, UserRoles.Provider, UserRoles.Admin]), validateRequest(UpdateuserProfileData), UserController.UpateUserProfile);
router6.get("/user/profile/:id", auth_default([UserRoles.Customer, UserRoles.Admin, UserRoles.Provider]), UserController.getUserprofile);
router6.put("/admin/profile/:id", auth_default([UserRoles.Admin]), validateRequest(UpdateUserCommonData), UserController.UpdateUser);
router6.delete("/user/profile/own", auth_default([UserRoles.Provider, UserRoles.Customer, UserRoles.Admin]), UserController.OwnProfileDelete);
router6.delete("/user/profile/:id", auth_default([UserRoles.Admin]), UserController.DeleteUserProfile);
var UserRouter = { router: router6 };

// src/modules/reviews/reviews.route.ts
import { Router as Router7 } from "express";

// src/modules/reviews/reviews.service.ts
var CreateReviews = async (customerid, mealid, data) => {
  const existingmeal = await prisma.meal.findUnique({
    where: {
      id: mealid
    }
  });
  if (!existingmeal) {
    throw new AppError_default(404, "meal not found for this id");
  }
  const orderMeal = await prisma.orderitem.findFirst({
    where: {
      mealId: mealid,
      order: {
        customerId: customerid
      }
    }
  });
  if (!orderMeal) {
    throw new AppError_default(404, "you can not review for this meal without order");
  }
  if (data.rating >= 6) {
    throw new AppError_default(400, "rating must be between 1 and 5");
  }
  const result = await prisma.review.create({
    data: {
      customerId: customerid,
      mealId: mealid,
      ...data
    }
  });
  return result;
};
var updateReview = async (reviewId, data, authorId) => {
  const review = await prisma.review.findFirst({
    where: {
      id: reviewId,
      customerId: authorId
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "your review not found,please update your own review");
  }
  const result = await prisma.review.update({
    where: {
      id: reviewId,
      customerId: authorId
    },
    data: {
      ...data
    }
  });
  return {
    success: true,
    message: `your review update successfully`,
    result
  };
};
var deleteReview = async (reviewid, authorid) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    select: {
      id: true
    }
  });
  if (!review) {
    throw new AppError_default(404, "review not found");
  }
  const result = await prisma.review.delete({
    where: {
      id: review.id
    }
  });
  return result;
};
var getReviewByid = async (reviewid) => {
  const result = await prisma.review.findUnique({
    where: {
      id: reviewid
    },
    include: {
      meal: true
    }
  });
  if (!result) {
    throw new AppError_default(404, "review not found");
  }
  return result;
};
var moderateReview = async (id, data) => {
  const { status: status16 } = data;
  const reviewData = await prisma.review.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      status: true
    }
  });
  if (!reviewData) {
    throw new AppError_default(404, "review data not found by id");
  }
  if (reviewData.status === data.status) {
    throw new AppError_default(409, `Your provided status (${data.status}) is already up to date.`);
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      status: status16
    }
  });
  return result;
};
var getAllreviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      customer: true,
      meal: true,
      replies: true
    }
  });
  return result;
};
var ReviewsService = { CreateReviews, updateReview, deleteReview, getReviewByid, moderateReview, getAllreviews };

// src/modules/reviews/reviews.controller.ts
import status13 from "http-status";
var CreateReviews2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const result = await ReviewsService.CreateReviews(user.id, req.params.id, req.body);
  sendResponse(res, {
    httpStatusCode: status13.CREATED,
    success: true,
    message: "your review has been created successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ success: false, message: "you are unauthorized" });
  }
  const { reviewid } = req.params;
  const result = await ReviewsService.updateReview(reviewid, req.body, user?.id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "review update successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const { reviewid } = req.params;
    const result = await ReviewsService.deleteReview(reviewid, user?.id);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "review delete successfully",
      data: result
    });
  }
);
var moderateReview2 = catchAsync(async (req, res) => {
  const { reviewid } = req.params;
  const result = await ReviewsService.moderateReview(reviewid, req.body);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "review moderate successfully",
    data: result
  });
});
var getReviewByid2 = catchAsync(
  async (req, res) => {
    const { reviewid } = req.params;
    const result = await ReviewsService.getReviewByid(reviewid);
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "retrieve review by id successfully",
      data: result
    });
  }
);
var getAllreviews2 = catchAsync(
  async (req, res) => {
    const result = await ReviewsService.getAllreviews();
    sendResponse(res, {
      httpStatusCode: status13.OK,
      success: true,
      message: "retrieve all reviews successfully",
      data: result
    });
  }
);
var ReviewsController = { CreateReviews: CreateReviews2, updateReview: updateReview2, deleteReview: deleteReview2, getReviewByid: getReviewByid2, moderateReview: moderateReview2, getAllreviews: getAllreviews2 };

// src/modules/reviews/reviews.validation.ts
import z6 from "zod";
var createReviewsData = z6.object({
  rating: z6.number().min(1).max(5),
  comment: z6.string(),
  parentId: z6.string().optional()
});
var updateReviewsData = z6.object({
  rating: z6.number().min(1).max(5).optional(),
  comment: z6.string().optional()
});
var moderateData = z6.object({
  status: z6.enum(["APPROVED", "REJECTED"])
});

// src/modules/reviews/reviews.route.ts
var router7 = Router7();
router7.post("/meal/:id/review", auth_default([UserRoles.Customer]), validateRequest(createReviewsData), ReviewsController.CreateReviews);
router7.put("/review/:reviewid", auth_default([UserRoles.Customer]), validateRequest(updateReviewsData), ReviewsController.updateReview);
router7.delete("/review/:reviewid", auth_default([UserRoles.Customer, UserRoles.Admin]), ReviewsController.deleteReview);
router7.get("/reviews", ReviewsController.getAllreviews);
router7.get("/review/:reviewid", ReviewsController.getReviewByid);
router7.patch("/review/:reviewid/moderate", auth_default([UserRoles.Admin]), validateRequest(moderateData), ReviewsController.moderateReview);
var ReviewsRouter = { router: router7 };

// src/modules/stats/stats.route.ts
import { Router as Router8 } from "express";

// src/modules/stats/stats.service.ts
var getuserStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalUsers, totalSuspendUser, totalActivateUser, totalAdmin, totalCustomer, totalprovider, todaystats, oneMonthago, totalemailvarified, totalactiveusers, totalunactiveuser] = await Promise.all([
      await tx.user.count(),
      await tx.user.count({ where: { status: "suspend" } }),
      await tx.user.count({ where: { status: "activate" } }),
      await tx.user.count({ where: { role: "Admin" } }),
      await tx.user.count({ where: { role: "Customer" } }),
      await tx.user.count({ where: { role: "Provider" } }),
      await tx.user.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.user.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.user.count({ where: { emailVerified: false } }),
      await tx.user.count({ where: { isActive: true } }),
      await tx.user.count({ where: { isActive: false } })
    ]);
    return {
      totalUsers,
      totalSuspendUser,
      totalActivateUser,
      totalAdmin,
      totalCustomer,
      totalprovider,
      todaystats,
      oneMonthago,
      totalemailvarified,
      totalactiveusers,
      totalunactiveuser
    };
  });
};
var getmealsStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals, totalapprovedmeals, totalpendingmeals, totalrejectedmeals] = await Promise.all([
      await tx.meal.count(),
      await tx.meal.count({ where: { isAvailable: true } }),
      await tx.meal.count({ where: { isAvailable: false } }),
      await tx.meal.count({ where: { status: "APPROVED" } }),
      await tx.meal.count({ where: { status: "PENDING" } }),
      await tx.meal.count({ where: { status: "REJECTED" } })
    ]);
    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals,
      totalapprovedmeals,
      totalpendingmeals,
      totalrejectedmeals
    };
  });
};
var getordersStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] = await Promise.all([
      await tx.order.count(),
      await tx.order.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.count({ where: { status: "CANCELLED" } }),
      await tx.order.count({ where: { status: "PLACED" } }),
      await tx.order.count({ where: { status: "PREPARING" } }),
      await tx.order.count({ where: { status: "READY" } }),
      await tx.order.count({ where: { status: "DELIVERED" } }),
      await tx.order.aggregate({ _sum: { totalPrice: true } }),
      await tx.orderitem.aggregate({ _sum: { quantity: true } }),
      await tx.order.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } })
    ]);
    return {
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders
    };
  });
};
var getrevenueStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] = await Promise.all([
      await tx.order.aggregate({ _sum: { totalPrice: true } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.aggregate({ _avg: { totalPrice: true } }),
      await tx.order.groupBy({ by: ["providerId"], orderBy: { _sum: { totalPrice: "desc" } }, take: 5 })
    ]);
    return {
      totalrevenue,
      todaysRevenue,
      monthlyRevenue,
      avgrevenue,
      topProvidersrevenue
    };
  });
};
var getreviewStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalreviews, todayreviews, topRatedMeals] = await Promise.all([
      await tx.review.count(),
      await tx.review.count({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.review.groupBy({ by: ["mealId"], _avg: { rating: true }, orderBy: { _avg: { rating: "desc" } }, take: 4 })
    ]);
    return {
      totalreviews,
      todayreviews,
      topRatedMeals
    };
  });
};
var getcategoryStats = async (adminid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: adminid
    }
  });
  if (existuser.id !== adminid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalcategory, totalcategory_name, mealsPerCategory] = await Promise.all([
      await tx.category.count(),
      await tx.category.findMany({ select: { name: true } }),
      await tx.meal.groupBy({
        by: ["category_name"],
        _count: {
          _all: true
        }
      })
    ]);
    return {
      totalcategory,
      totalcategory_name,
      mealsPerCategory
    };
  });
};
var getrevenueProviderStats = async (userid) => {
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  console.log(userid);
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalrevenue, todaysRevenue, monthlyRevenue, avgrevenue, topProvidersrevenue] = await Promise.all([
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _sum: { totalPrice: true } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { providerId: existuser.provider.id, createdAt: { gte: startOfToday, lte: endOfToday } } }),
      await tx.order.aggregate({ _sum: { totalPrice: true }, where: { providerId: existuser.provider.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _avg: { totalPrice: true } }),
      await tx.order.groupBy({ where: { providerId: existuser.provider.id }, by: ["providerId"], orderBy: { _sum: { totalPrice: "desc" } }, take: 5 })
    ]);
    return {
      totalrevenue,
      todaysRevenue,
      monthlyRevenue,
      avgrevenue,
      topProvidersrevenue
    };
  });
};
var getProvidermealsStats = async (userid) => {
  console.log("get melass");
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const [totalmeals, totalavailabemeals, totalunavailabemeals] = await Promise.all([
      await tx.meal.count({ where: { providerId: existuser.provider.id } }),
      await tx.meal.count({ where: { providerId: existuser.provider.id, isAvailable: true } }),
      await tx.meal.count({ where: { providerId: existuser.provider.id, isAvailable: false } })
      // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'APPROVED' } }),
      // await tx.meal.count({ where: { providerId:existuser.provider!.id,status: 'PENDING' } }),
      // await tx.meal.count({ where: {providerId:existuser.provider!.id, status: 'REJECTED' } }),
    ]);
    return {
      totalmeals,
      totalavailabemeals,
      totalunavailabemeals
      // totalapprovedmeals,
      // totalpendingmeals,
      // totalrejectedmeals
    };
  });
};
var getProviderordersStats = async (userid) => {
  const todayOrdersData = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
        lte: new Date((/* @__PURE__ */ new Date()).setHours(23, 59, 59, 999))
      }
    }
  });
  console.log("TODAY DATA:", todayOrdersData);
  console.log("TODAY LENGTH:", todayOrdersData.length);
  const existuser = await prisma.user.findUniqueOrThrow({
    where: {
      id: userid
    },
    include: {
      provider: {
        select: {
          id: true
        }
      }
    }
  });
  if (existuser.id !== userid) {
    throw new Error("you are unauthorize");
  }
  return await prisma.$transaction(async (tx) => {
    const startOfToday = /* @__PURE__ */ new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = /* @__PURE__ */ new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const startOfMonth = /* @__PURE__ */ new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = /* @__PURE__ */ new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);
    const [totalorders, oneMonth, totalcancelledmeals, totalplacedmeals, totalpreparingmeals, totalreadymeals, totaldeliveredmeals, allearn, totalquantity, todayorders] = await Promise.all([
      await tx.order.count({ where: { providerId: existuser.provider.id } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "CANCELLED" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "PLACED" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "PREPARING" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "READY" } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, status: "DELIVERED" } }),
      await tx.order.aggregate({ where: { providerId: existuser.provider.id }, _sum: { totalPrice: true } }),
      await tx.orderitem.aggregate({ where: { order: {
        providerId: existuser.provider.id
      } }, _sum: { quantity: true } }),
      await tx.order.count({ where: { providerId: existuser.provider.id, createdAt: { gte: startOfToday, lte: endOfToday } } })
    ]);
    return {
      totalorders,
      oneMonth,
      totalcancelledmeals,
      totalplacedmeals,
      totalpreparingmeals,
      totalreadymeals,
      totaldeliveredmeals,
      allearn,
      totalquantity,
      todayorders
    };
  });
};
var StatsService = {
  getuserStats,
  getmealsStats,
  getordersStats,
  getrevenueStats,
  getreviewStats,
  getcategoryStats,
  getrevenueProviderStats,
  getProvidermealsStats,
  getProviderordersStats
};

// src/modules/stats/stats.controller.ts
import status14 from "http-status";
var getuserStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(status14.UNAUTHORIZED).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getuserStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve user stats successfully",
      data: result
    });
  }
);
var getmealsStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getmealsStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve meals stats successfully",
      data: result
    });
  }
);
var getordersStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getordersStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve orders stats successfully",
      data: result
    });
  }
);
var getrevenueStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getrevenueStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve revenue stats successfully",
      data: result
    });
  }
);
var getreviewStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getcategoryStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve review stats successfully",
      data: result
    });
  }
);
var getcategoryStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getcategoryStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve category stats successfully",
      data: result
    });
  }
);
var getrevenueProviderStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getrevenueProviderStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve revenue provider stats successfully",
      data: result
    });
  }
);
var getProvidermealsStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getProvidermealsStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve provider meals stats successfully",
      data: result
    });
  }
);
var getProviderordersStats2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: "you are unauthorized" });
    }
    const result = await StatsService.getProviderordersStats(user.id);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "retrieve provider order stats successfully",
      data: result
    });
  }
);
var StatsController = {
  getuserStats: getuserStats2,
  getmealsStats: getmealsStats2,
  getordersStats: getordersStats2,
  getrevenueStats: getrevenueStats2,
  getreviewStats: getreviewStats2,
  getcategoryStats: getcategoryStats2,
  getrevenueProviderStats: getrevenueProviderStats2,
  getProvidermealsStats: getProvidermealsStats2,
  getProviderordersStats: getProviderordersStats2
};

// src/modules/stats/stats.route.ts
var router8 = Router8();
router8.get("/admin/users/stats", auth_default([UserRoles.Admin]), StatsController.getuserStats);
router8.get("/admin/meals/stats", auth_default([UserRoles.Admin]), StatsController.getmealsStats);
router8.get("/admin/orders/stats", auth_default([UserRoles.Admin]), StatsController.getordersStats);
router8.get("/admin/revenue/stats", auth_default([UserRoles.Admin]), StatsController.getrevenueStats);
router8.get("/admin/reviews/stats", auth_default([UserRoles.Admin]), StatsController.getreviewStats);
router8.get("/admin/category/stats", auth_default([UserRoles.Admin]), StatsController.getcategoryStats);
router8.get("/provider/revenue/stats", auth_default([UserRoles.Provider]), StatsController.getrevenueProviderStats);
router8.get("/provider/meals/stats", auth_default([UserRoles.Provider]), StatsController.getProvidermealsStats);
router8.get("/provider/orders/stats", auth_default([UserRoles.Provider]), StatsController.getProviderordersStats);
var StatsRouter = { router: router8 };

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";

// src/middleware/globalErrorHandeller.ts
import status15 from "http-status";
function errorHandler(err, req, res, next) {
  let statusCode = status15.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources = [];
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = status15.BAD_REQUEST;
    message = "Validation Error";
    errorSources.push({ message: err.message });
  } else if (err?.code === "ETIMEDOUT" || err?.code === "PROTOCOL_TIMEOUT") {
    statusCode = status15.GATEWAY_TIMEOUT;
    message = "Database request timed out. Please retry after a short while.";
    errorSources.push({ message });
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode || status15.BAD_REQUEST;
    message = err.message;
    errorSources.push({ message: err.message });
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // ডেভেলপমেন্ট মোডে থাকলে স্ট্যাক ট্রেস দেখতে পারেন
    stack: process.env.NODE_ENV === "development" ? err.stack : void 0
  });
}
var globalErrorHandeller_default = errorHandler;

// src/app.ts
var app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use("/api", mealRouter.router);
app.use("/api", providerRouter.router);
app.use("/api", OrderRouter.router);
app.use("/api", CategoryRouter.router);
app.use("/api", UserRouter.router);
app.use("/api", ReviewsRouter.router);
app.use("/api", StatsRouter.router);
app.use("/api/auth", authRouter.router);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(globalErrorHandeller_default);
app.use(Notfound);
var app_default = app;

// src/server.ts
var port = process.env.PORT || 4e3;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("connected to database successfully");
    app_default.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message || error);
    if (error?.stack) console.error(error.stack);
    await prisma.$disconnect();
    process.exit(1);
  }
};
main();
