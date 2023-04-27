'use client'

import {ButtonHTMLAttributes, FC} from 'react'
import {Copy} from 'lucide-react'
import Button from '@/ui/Button'
import {toast} from '@/ui/Toast'

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  valueToCopy: string
}

const CopyButton: FC<CopyButtonProps> = ({
  valueToCopy,
  className,
  ...props
}) => (
  <Button
    {...props}
    variant='ghost'
    className={className}
    onClick={() => {
      navigator.clipboard.writeText(valueToCopy)

      toast({
        title: 'Copied!',
        message: 'API key copied to clipboard',
        type: 'success'
      })
    }}
  >
    <Copy className='h-5 w-5' />
  </Button>
)

export default CopyButton
