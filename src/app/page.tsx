import {Inter} from 'next/font/google'
import Paragraph from '@/ui/Paragraph'

const inter = Inter({subsets: ['latin']})

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Paragraph size='sm'></Paragraph>
    </main>
  )
}
