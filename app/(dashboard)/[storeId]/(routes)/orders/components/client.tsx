"use client";

import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";
import Heading from "@/components/ui/Heading";
import { DataTable } from "@/components/ui/DataTable";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchkey="products" columns={columns} data={data} />
    </>
  );
};
