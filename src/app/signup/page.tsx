import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Redirect old signup page to founding partner page
  redirect('/founding-member')
}
