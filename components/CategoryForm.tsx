"use client";

import * as z from "zod";

import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CategoryFormProps {
  initialData: Category | undefined | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(3).max(20),
  billboardId: z.string(),
});

const CategoryForm = ({ billboards, initialData }: CategoryFormProps) => {
  const params = useParams();
  const router = useRouter();
  // triguiring the alert modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // this page will work for both the edite and the create category
  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add new category";
  const toastmsg = initialData ? "category updated" : "category created";
  const action = initialData ? "Save Changes" : "Create";

  // form state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  // onSubmit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (initialData) {
        // upating the data
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values
        );
      } else {
        // else creating a new billboard
        await axios.post(`/api/${params.storeId}/categories/`, values);
      }
      // refreshing the page
      toast.success(toastmsg);
      router.refresh();
      router.push(`/${params.storeId}/categories/`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      toast.success("Billboard has been deleted successfully");
      router.refresh();
      router.back();
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error(
        "Make sure you deleted all the products using category first"
      );
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
          <div className="flex items-center gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          ></SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem value={billboard.id} key={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
