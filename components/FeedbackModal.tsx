'use client'

import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'

type FeedbackModalProps = {
  title: string
  placeholder: string
  toEmail?: string
  subject: string
  userDisplayName: string
  userId?: string
  email?: string
  variant?: 'primary' | 'secondary'
}

const FeedbackModal = forwardRef<HTMLDialogElement, FeedbackModalProps>(
  ({ title, placeholder, toEmail, subject, userDisplayName, userId, email, variant = 'primary' }, forwardedRef) => {
    const internalRef = useRef<HTMLDialogElement | null>(null)
    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLDialogElement)

    const [text, setText] = useState('')
    const [copied, setCopied] = useState(false)

    const composedBody = useMemo(() => {
      const context = [
        '--- Context ---',
        `User: ${userDisplayName}`,
        `User ID: ${userId || 'N/A'}`,
        `Email: ${email || 'N/A'}`,
        `URL: ${typeof window !== 'undefined' ? window.location.href : ''}`,
        `UA: ${typeof navigator !== 'undefined' ? navigator.userAgent : ''}`,
      ].join('\n')
      return `${text}\n\n${context}`
    }, [text, userDisplayName, userId, email])

    const mailtoHref = useMemo(() => {
      const body = encodeURIComponent(composedBody)
      const subj = encodeURIComponent(subject)
      return `mailto:${toEmail || ''}?subject=${subj}&body=${body}`
    }, [composedBody, subject, toEmail])

    const close = () => {
      internalRef.current?.close()
    }

    const copyDetails = async () => {
      try {
        await navigator.clipboard.writeText(composedBody)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // ignore
      }
    }

    return (
      <dialog ref={internalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <textarea
            className="textarea textarea-bordered w-full min-h-32"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-4 flex flex-wrap gap-2 justify-end">
            <button className="btn" onClick={close}>Cancel</button>
            <button className="btn btn-ghost" onClick={copyDetails}>
              {copied ? 'Copied!' : 'Copy details'}
            </button>
            <a
              href={mailtoHref}
              className={`btn btn-${variant} ${text.trim().length === 0 ? 'btn-disabled' : ''}`}
              onClick={() => {
                if (text.trim().length === 0) {
                  internalRef.current?.close()
                }
              }}
            >
              Send email
            </a>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close" />
        </form>
      </dialog>
    )
  }
)

FeedbackModal.displayName = 'FeedbackModal'
export default FeedbackModal

