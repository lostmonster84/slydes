import { redirect } from 'next/navigation'

export default function SignupPage() {
  // Redirect old signup page to founding member page
  redirect('/founding-member')
}
