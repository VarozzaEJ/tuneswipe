import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import {commentsService} from "../services/commentsservice"
import { toast } from 'sonner';

 type FormData = {
  body: string;
  postId: string
}

const formSchema : ZodType<FormData> = z.object({
  body: z.string().min(5, {
    message: "Comment must be at least 5 characters.",
  }).max(500).default(""),
  postId: z.string().optional()
});

export default function useCommentForm() {
   
  const [comment, setComment] = useState({})
  const [postId, setPostId] = useState("")
    console.log(postId)

    const {register, handleSubmit, reset} = useForm<FormData>({resolver: zodResolver(formSchema)})


    const submitForm = async (data : FormData) => {
    console.log("📊", data);
    data.postId = postId;
    const comment = await commentsService.createComment(data)
    setComment(comment)
    reset()
    // toast.success("Comment Created")
  };

  return {
    comment,
    render:({postId}) => (
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
                        <Button onClick={() => {
                          setPostId(postId)
                          
                        }} type="submit" className="rounded-full ms-2">
                          <Icon path={mdiPlus} size={1} />
                        </Button>
                      </form>
                        )
  
}
}