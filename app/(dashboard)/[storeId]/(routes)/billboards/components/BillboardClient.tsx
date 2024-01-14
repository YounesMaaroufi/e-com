"use client";

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";

import { Separator } from "@radix-ui/react-separator";

import { Plus } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";

interface billboardsProps {
  data: BillboardColumn[];
}

const BillboardClient = ({ data }: billboardsProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboarded (${data.length})`}
          description="Manage billboards for you store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchkey="label" columns={columns} data={data} />
      <Heading title="API" description="API calls for Billobards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};

export default BillboardClient;
