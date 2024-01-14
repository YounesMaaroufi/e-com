"use client";

import * as z from "zod";

import { Billboard } from "@prisma/client";
import Heading from "./ui/Heading";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/modals/AlertModal";
import ImageUpload from "./ui/ImageUpload";

interface BillboardFormProps {
  initialData: Billboard | undefined | null;
}

const formSchema = z.object({
  label: z.string().min(2).max(50),
  imageUrl: z.string().min(1),
});

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const params = useParams();
  const router = useRouter();
  // triguiring the alert modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // this page will work for both the edite and the create billboard
  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add new billboard";
  const toastmsg = initialData ? "billboard updated" : "billboard created";
  const action = initialData ? "Save Changes" : "Create";

  // form state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  // onSubmit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        // upating the data
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        // else creating a new billboard
        await axios.post(`/api/${params.storeId}/billboards/`, values);
      }
      // refreshing the page
      toast.success(toastmsg);
      router.push(`/${params.storeId}/billboards/`);
    } catch (err) {
      console.log(err);
      router.refresh();
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // onDelete handler
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      toast.success("Billboard has been deleted successfully");
      router.refresh();
      router.back();
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Make sure you deleted all the products first");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col items-start gap-8">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="ml-auto">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
