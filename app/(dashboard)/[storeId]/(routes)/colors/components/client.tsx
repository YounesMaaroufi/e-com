"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { columns, ColorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";
import Heading from "@/components/ui/Heading";

interface ColorClientProps {
  data: ColorColumn[];
}

export const ColorClient: React.FC<ColorClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors for your products"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchkey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
