import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { commentsService } from "../services/commentsservice";
import { toast } from "sonner";

type FormData = {
  body?: string | undefined;
  postId?: string | undefined;
};
//TODO show after the input when a comment must be five characters
const formSchema: ZodType<FormData> = z.object({
  body: z
    .string()
    .min(5, {
      message: "Comment must be at least 5 characters.",
    })
    .max(500)
    .default(""),
    postId: z.string().optional(),
});

export default function useCommentForm() {
  const [comment, setComment] = useState({});
  const [postId, setPostId] = useState("");
  const [length, setLength] = useState("")

  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const submitForm = async (data: FormData) => {
    console.log("📊", data);
    data.postId = postId;
    const comment = await commentsService.createComment(data);
    setComment(comment);
    reset();
    // toast.success("Comment Created")
  };

  return {
    comment,
    render: ({ postId, setZeroComments }) => (
      <form className="flex" onSubmit={handleSubmit(submitForm)}>
          <>
            <Input
              className="bg-slate-950"
              {...register("body")}
              type="text"
              placeholder="Add a comment..."
              onChange={(e) => {
                setLength(e.target.value)
              }}
            />
            <Button
              onClick={() => {
                setPostId(postId);
                setZeroComments(false)
                if(length.length < 5) toast.error(`Comment must be at least 5 characters.`)
              }}
              type="submit"
              className="rounded-full ms-2"
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </>
      </form>
    ),
  };
}
