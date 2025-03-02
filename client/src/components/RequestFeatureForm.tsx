import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { FormDescription } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { z, ZodType } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountService } from '../services/accountService.js'

type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    description: string;
    reproduction: string;
}

export default function RequestFeatureForm() {

    const formSchema : ZodType<FormData> = z.object({
        firstName: z.string().min(2, "First name must be 2 characters").max(50, "First name can't exceed 50 characters"),
        lastName: z.string().min(2, "Last name must be 2 characters").max(50, "Last name can't exceed 50 characters"),
        email: z.string().email("Invalid email address"),
        description: z.string({message: "Description is required"}).min(15, "Description must be at least 15 characters long").max(250, "Description must be at most 250 characters long"),
        reproduction: z.string({message: "Explanation is required"}).min(15, "Explanation must be at least 15 characters long").max(500, "Explanation must be at most 500 characters long")
     })

     const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(formSchema) })

     const submitForm = async (data : FormData) => {
        await accountService.requestFeature(data)
     }
    

  return (
    <form onSubmit={handleSubmit(submitForm)}>
        <div className="md:flex md:justify-between">
            <div>
                <Label  htmlFor="firstName">First Name</Label>
                { errors.firstName && <p className='text-destructive text-sm'>{errors.firstName.message}</p>}
                <Input {...register("firstName")} className='mb-3 border-0 active:border-0 mt-1 bg-slate-950 w-full' id="firstName" type="firstName" placeholder='e.g. John' />
            </div>
            <div>
                <Label  htmlFor="lastName">Last Name</Label>
                { errors.lastName && <p className='text-destructive text-sm'>{errors.lastName.message}</p>}
                <Input {...register("lastName")} className='mb-3 border-0 active:border-0 mt-1 bg-slate-950 w-full' id="lastName" type="lastName" placeholder='e.g. Smith' />
            </div>
        </div>
        <div>
            <Label  htmlFor="email">Your Email</Label>
            { errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
            <Input {...register("email")} className='mb-3 border-0 active:border-0 mt-1 bg-slate-950' id="email" type="email" placeholder='e.g. example@gmail.com' />
        </div>
        <div>
            <Label htmlFor="description">What would you like to see added?</Label>
            { errors.description && <p className='text-destructive text-sm'>{errors.description.message}</p>}
            <Input {...register("description")} className='mb-3 border-0 focus-visible:ring-0 mt-1 bg-slate-950' id="description"  placeholder='e.g. I would like to see a dark mode feature' />
        </div>
        <div>
            <Label htmlFor="reproduction">Please explain how it would work.</Label>
            { errors.reproduction && <p className='text-destructive text-sm'>{errors.reproduction.message}</p>}
            <Textarea {...register("reproduction")} className='mb-3 border-0 focus-visible:ring-0 mt-1 bg-slate-950' id="reproduction" rows={3}  placeholder='Type here' />
        </div>
        <div className='flex justify-end'>
            <Button type='submit'>Submit</Button>
        </div>
    </form>
  )
}
