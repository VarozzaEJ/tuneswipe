import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from 'sonner';
import { Textarea } from "@/components/ui/textarea"
import {commentsService} from "../services/commentsservice.js"

type FormData = {
description: string;
type: string;
commentId: string;
commentCreatorName: string;
}

const formSchema : ZodType<FormData> = z.object({
description: z.string().min(5, {
message: "Description must be at least 5 characters.",
}).max(500, {
message: "Description must not exceed 500 characters"
}),
type: z.enum(["vulgar language", "spam", "harrassment", "other"]),
commentId: z.string().optional(),
commentCreatorName: z.string().optional(),
});
export default function ReportCommentForm({commentId, commentCreatorName, handler, handler2}) {
 
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
        data.commentId = commentId
        data.commentCreatorName = commentCreatorName
        console.log(data)
        const report = await commentsService.reportComment(data)
        if(report) {
            toast.success("Report Recieved!")
            handler()
            handler2()
        } else {
            toast.error("Error!")
        }
    }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
              <FormItem className="space-y-3">
              <FormLabel></FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                  >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="spam" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Spam
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="harrassment" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Harrassment
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="vulgar language" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Vulgar Language
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel className="font-normal">Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField control={form.control} 
          name='description' 
          render = {({field}) => (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea className=' bg-slate-800' placeholder='Describe why you are reporting this post' 
                    {...field}/>
                </FormControl>
                <FormMessage />
            </FormItem>
          )}
          />
          <div className='w-full flex justify-end'>
        <Button type="submit">Submit</Button>
          </div>
      </form>
    </Form>
    </>
  )
}
