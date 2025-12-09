import logo from '@/public/assets/logo.png'
import Image from 'next/image'

export default function CustomLogo() {
  return <Image src={logo} alt="Custom Logo" className="h-20 w-20 dark:hidden" />
}
