"use client";

import * as z from "zod";

import { Store } from "@prisma/client";
import Heading from "@/components/ui/Heading";
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
import { ApiAlert } from "./ui/ApiAlert";
import { useOrigin } from "@/hooks/useOrigin";

interface SettingsFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(2).max(50),
});

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const params = useParams();
  const router = useRouter();
  // triguiring the alert modal
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // form state
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  // onSubmit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, values);
      // refreshing the page
      router.refresh();
      toast.success("store updated");
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };
  // onDelete handler
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      toast.success("Store has been deleted successfully");
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error("Make sure you deleted all the products first");
    } finally {
      setLoading(false);
    }
  };

  const origin = useOrigin();
  return (
    <>
      {/* this modal is triggered by the open state */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-ocls-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={loading} className="ml-auto">
            Save Changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        variant="public"
        title="PUBLIC_API_ROUTE"
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
};

export default SettingsForm;
