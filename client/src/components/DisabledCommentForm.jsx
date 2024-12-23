import React from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { commentsService } from "../services/commentsservice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
export default function DisabledCommentForm() {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex">
              <Input
                disabled
                className="bg-slate-950"
                type="text"
                placeholder="Login to comment"
              />
              <Button disabled type="submit" className="rounded-full ms-2">
                <Icon path={mdiPlus} size={1} />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Login to comment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
