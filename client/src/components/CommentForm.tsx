import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import {commentsService} from "../services/commentsservice"

 type FormData = {
  body: string;
  postId: string
}

const formSchema : ZodType<FormData> = z.object({
  body: z.string().min(5, {
    message: "Comment must be at least 5 characters.",
  }).max(500),
  postId: z.string().optional()
});
export default function CommentForm({postId}) {
   
    console.log(postId)

    const {register, handleSubmit} = useForm<FormData>({resolver: zodResolver(formSchema)})


    const submitForm = async (data : FormData) => {
    console.log("📊", data);
    data.postId = postId;
    await commentsService.createComment(data)
    // toast.success("Comment Created")
  };

  return (
    <form
                        className="flex"
                        onSubmit={handleSubmit(submitForm)}
                      >
                        <Input
                          className="bg-slate-950"
                          {...register("body")}
                          type="text"
                          placeholder="Add a comment..."
                        />
                        <Button onClick={handleSubmit(submitForm)} type="submit" className="rounded-full">
                          <Icon path={mdiPlus} size={1} />
                        </Button>
                      </form>
  )
}
