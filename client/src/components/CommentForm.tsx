import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

 type FormData = {
  comment: string;
  postId: string
}

const formSchema : ZodType<FormData> = z.object({
  comment: z.string().min(5, {
    message: "Message must be at least 5 characters.",
  }).max(500),
  postId: z.string()
});
export default function CommentForm({postId}) {
   
    console.log(postId)

    const {register, handleSubmit} = useForm<FormData>({resolver: zodResolver(formSchema)})

    const submitForm = async (data) => {
    console.log("📊", data);
    data.postId = postId;
    console.log(data);
    // await commentsService.createPost(data)
    // toast.success("Comment Created")
  };

  return (
    <form
                        className="flex"
                        onSubmit={handleSubmit(submitForm)}
                      >
                        <Input
                          className="bg-slate-950"
                          {...register("comment")}
                          type="text"
                          placeholder="Add a comment..."
                        />
                        <Button type={"submit"} className="rounded-full">
                          <Icon path={mdiPlus} size={1} />
                        </Button>
                      </form>
  )
}
