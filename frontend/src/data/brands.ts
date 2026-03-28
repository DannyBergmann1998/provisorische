export type RepairBrand = {
  name: string;
  slug: string;
  logo: string;
  models: string[];
};

export const repairBrands: RepairBrand[] = [
  {
    name: "Apple",
    slug: "apple",
    logo: "/brands/apple.svg",
    models: ["iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro", "iPhone 14", "iPhone 13", "iPad Pro", "iPad Air"],
  },
  {
    name: "Samsung",
    slug: "samsung",
    logo: "/brands/samsung.svg",
    models: ["Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23", "Galaxy A54", "Galaxy Z Fold5", "Galaxy Tab S9"],
  },
  {
    name: "Huawei",
    slug: "huawei",
    logo: "/brands/huawei.svg",
    models: ["P60 Pro", "P50", "Mate 50 Pro", "Nova 11", "Mate X3", "MatePad Pro"],
  },
  {
    name: "Xiaomi",
    slug: "xiaomi",
    logo: "/brands/xiaomi.svg",
    models: ["14 Ultra", "14", "13T Pro", "Redmi Note 13 Pro", "POCO X6 Pro", "Pad 6S Pro"],
  },
];
