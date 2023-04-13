import {getServerSession} from 'next-auth'
import Link from 'next/link'
import SignInButton from '@/components/SignInButton'
import SignOutButton from '@/components/SignOutButton'
import ThemeToggle from '@/components/ThemeToggle'
import {buttonVariants} from '@/ui/Button'

const Navbar = async (): Promise<JSX.Element> => {
  const session = await getServerSession()

  return (
    <nav className='fixed backdrop-blur-sm bg-white/75 dark:bg-slate-900 z-50 top-0 left-0 right-0 border-b border-slate-300 dark:border-slate-700 shadow-sm flex items-center justify-between py-2'>
      <div className='container max-w-7xl mx-auto w-full flex justify-between items-center'>
        <Link href='/' className={buttonVariants({variant: 'link'})}>
          Text Similarity 1.0
        </Link>

        <div className='md:hidden'>
          <ThemeToggle />
        </div>

        <div className='hidden md:flex gap-4'>
          <ThemeToggle />
          <Link
            href='/documentation'
            className={buttonVariants({variant: 'ghost'})}
          >
            Documentation
          </Link>

          {session ? (
            <>
              <Link
                href='/dashboard'
                className={buttonVariants({variant: 'ghost'})}
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
