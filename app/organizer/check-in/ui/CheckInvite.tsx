"use client"
import { useEffect, useRef, useState } from 'react'

type Result = {
  code: string
  status: 'issued' | 'used' | 'cancelled'
  eventId: string
  eventTitle: string
  nickname?: string
  recipientEmail: string
}

export default function CheckInvite() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [data, setData] = useState<Result | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanningRef = useRef(false)
  const [scanning, setScanning] = useState(false)
  const [scanSupport, setScanSupport] = useState<'unknown' | 'supported' | 'unsupported'>('unknown')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function verify(value?: string) {
    const codeValue = (value ?? code).trim()
    if (!codeValue) return
    setLoading(true)
    setMsg(null)
    setData(null)
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(codeValue)}`)
      if (!res.ok) throw new Error(res.status === 404 ? 'Convite não encontrado' : await res.text())
      const json = (await res.json()) as Result
      setData(json)
    } catch (e: any) {
      setMsg(e.message || 'Erro ao verificar')
    } finally {
      setLoading(false)
    }
  }

  async function confirmUse() {
    if (!data) return
    setLoading(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(data.code)}/use`, { method: 'POST' })
      if (!res.ok) {
        if (res.status === 409) throw new Error('Convite já utilizado')
        if (res.status === 422) throw new Error('Convite cancelado')
        if (res.status === 404) throw new Error('Convite não encontrado')
        throw new Error(await res.text())
      }
      setMsg('Entrada confirmada com sucesso!')
      setData({ ...data, status: 'used' })
    } catch (e: any) {
      setMsg(e.message || 'Erro ao confirmar entrada')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setCode('')
    setData(null)
    setMsg(null)
    inputRef.current?.focus()
  }

  async function stopScan() {
    scanningRef.current = false
    setScanning(false)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      stopScan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startScan() {
    setMsg(null)
    setData(null)
    // Feature detection for BarcodeDetector
    const Detector = (window as any).BarcodeDetector
    if (!Detector) {
      setScanSupport('unsupported')
      setMsg('Leitura por câmera não suportada neste navegador. Digite o código manualmente.')
      return
    }
    try {
      const detector = new Detector({ formats: ['qr_code'] })
      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })
      streamRef.current = stream
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setScanSupport('supported')
      setScanning(true)
      scanningRef.current = true

      const scanLoop = async () => {
        if (!scanningRef.current) return
        try {
          if (videoRef.current) {
            const results = await detector.detect(videoRef.current)
            if (results && results.length > 0) {
              const raw = results[0].rawValue || results[0].raw || ''
              if (raw) {
                setCode(raw)
                await stopScan()
                await verify(raw)
                return
              }
            }
          }
        } catch (e) {
          // Ignore transient detector errors
        }
        // Throttle ~6fps
        setTimeout(() => requestAnimationFrame(scanLoop), 160)
      }
      requestAnimationFrame(scanLoop)
    } catch (e: any) {
      console.error(e)
      setMsg(e?.message || 'Não foi possível acessar a câmera')
      setScanSupport('unsupported')
      await stopScan()
    }
  }

  const statusBadge = data ? (
    data.status === 'issued' ? (
      <span className="px-2 py-1 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 text-xs">Válido</span>
    ) : data.status === 'used' ? (
      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 text-xs">Já utilizado</span>
    ) : (
      <span className="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 text-xs">Cancelado</span>
    )
  ) : null

  return (
    <div className="card p-4 space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          {!scanning ? (
            <button className="btn-ghost" onClick={startScan}>Ler QR com câmera</button>
          ) : (
            <button className="btn-ghost" onClick={stopScan}>Parar leitura</button>
          )}
        </div>
        {scanning && (
          <div className="rounded-md overflow-hidden border border-slate-200 dark:border-slate-800">
            <video ref={videoRef} className="w-full max-h-[300px] bg-black object-contain" muted playsInline />
          </div>
        )}
        {scanSupport === 'unsupported' && (
          <p className="muted">Seu navegador pode não suportar leitura de QR (BarcodeDetector). Use a entrada de código abaixo.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          className="input"
          placeholder="Código do convite (escaneado ou digitado)"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') verify() }}
        />
        <button className="btn-primary" onClick={() => verify()} disabled={loading || !code.trim()}>
          {loading ? 'Verificando...' : 'Verificar'}
        </button>
        <button className="btn-ghost" onClick={reset}>Limpar</button>
      </div>
      {msg && <p className="text-sm" aria-live="polite">{msg}</p>}
      {data && (
        <div className="border rounded-md p-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{data.eventTitle}</h3>
            {statusBadge}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">E-mail: {data.recipientEmail}</p>
          {data.nickname && <p className="text-sm text-slate-600 dark:text-slate-300">Apelido: “{data.nickname}”</p>}
          <p className="mt-2 muted">Código: {data.code}</p>
          <div className="mt-3 flex gap-2">
            <button
              className="btn-primary"
              onClick={confirmUse}
              disabled={loading || data.status !== 'issued'}
            >
              Confirmar entrada
            </button>
            <button className="btn-ghost" onClick={reset}>Novo código</button>
          </div>
        </div>
      )}
    </div>
  )
}
