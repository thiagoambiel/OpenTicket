"use client"
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex justify-center py-10">
      <SignIn
        appearance={{ elements: { rootBox: 'card p-6' } }}
        routing="hash"
        signUpUrl="/sign-in"
      />
    </div>
  )
}

