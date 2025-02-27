import React from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { FormDescription } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

export default function RequestFeatureForm() {
  return (
    <form>
        <div className="flex justify-between">
            <div>
                <Label  htmlFor="firstName">First Name</Label>
                <Input className='mb-3 border-0 active:border-0 mt-1 bg-slate-950 w-full' id="firstName" type="firstName" placeholder='e.g. John' />
            </div>
            <div>
                <Label  htmlFor="lastName">Last Name</Label>
                <Input className='mb-3 border-0 active:border-0 mt-1 bg-slate-950 w-full' id="lastName" type="lastName" placeholder='e.g. Smith' />
            </div>
        </div>
        <div>
            <Label  htmlFor="email">Your Email</Label>
            <Input className='mb-3 border-0 active:border-0 mt-1 bg-slate-950' id="email" type="email" placeholder='e.g. example@gmail.com' />
        </div>
        <div>
            <Label htmlFor="description">What would you like to see added?</Label>
            <Input className='mb-3 border-0 focus-visible:ring-0 mt-1 bg-slate-950' id="description"  placeholder='e.g. I would like to see a dark mode feature' />
        </div>
        <div>
            <Label htmlFor="reproduction">Please explain how it would work.</Label>
            <Textarea className='mb-3 border-0 focus-visible:ring-0 mt-1 bg-slate-950' id="reproduction" rows={3}  placeholder='Type here' />
        </div>
    </form>
  )
}
