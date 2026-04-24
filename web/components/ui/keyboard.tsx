"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type KeyboardTheme = "classic" | "mint" | "royal" | "dolch" | "sand" | "scarlet"
export type KeyPhase = "down" | "up"
export type KeySource = "physical" | "pointer"

export interface KeyboardInteractionEvent {
  code: string
  phase: KeyPhase
  source: KeySource
}

interface KeyboardProps {
  className?: string
  theme?: KeyboardTheme
  enableHaptics?: boolean
  enableSound?: boolean
  soundUrl?: string
  onKeyEvent?: (event: KeyboardInteractionEvent) => void
}

const themeColors: Record<KeyboardTheme, { primary: string; accent: string; text: string; textDark: string }> = {
  classic: {
    primary: "#2a2e35",
    accent: "#f57644",
    text: "#d1d5db",
    textDark: "#6b7280",
  },
  mint: {
    primary: "#1a2e2a",
    accent: "#4ade80",
    text: "#86efac",
    textDark: "#166534",
  },
  royal: {
    primary: "#1e2a4a",
    accent: "#60a5fa",
    text: "#93c5fd",
    textDark: "#1e40af",
  },
  dolch: {
    primary: "#2a2a2a",
    accent: "#888888",
    text: "#a3a3a3",
    textDark: "#525252",
  },
  sand: {
    primary: "#2a2620",
    accent: "#edb086",
    text: "#fcd5b5",
    textDark: "#92400e",
  },
  scarlet: {
    primary: "#3a1a1a",
    accent: "#f87171",
    text: "#fca5a5",
    textDark: "#991b1b",
  },
}

interface KeyProps {
  code: string
  label: string
  secondaryLabel?: string
  width?: number
  isAccent?: boolean
  icon?: React.ReactNode
  theme: KeyboardTheme
  onKeyEvent?: (event: KeyboardInteractionEvent) => void
  enableHaptics?: boolean
  enableSound?: boolean
  soundUrl?: string
}

function Key({
  code,
  label,
  secondaryLabel,
  width = 56,
  isAccent = false,
  icon,
  theme,
  onKeyEvent,
  enableHaptics,
  enableSound,
  soundUrl,
}: KeyProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [pressed, setPressed] = React.useState(false)

  React.useEffect(() => {
    if (enableSound && soundUrl) {
      audioRef.current = new Audio(soundUrl)
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [enableSound, soundUrl])

  const playSound = React.useCallback(() => {
    if (enableSound && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }, [enableSound])

  const triggerHaptic = React.useCallback(() => {
    if (enableHaptics && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }, [enableHaptics])

  const handlePress = React.useCallback(
    (phase: KeyPhase) => {
      setPressed(phase === "down")
      triggerHaptic()
      playSound()
      onKeyEvent?.({ code, phase, source: "pointer" })
    },
    [code, onKeyEvent, triggerHaptic, playSound]
  )

  const colors = themeColors[theme]

  return (
    <button
      type="button"
      aria-label={code}
      className="flex items-end cursor-pointer touch-none appearance-none border-0 bg-transparent p-0 text-left focus:outline-none"
      style={{ height: 52, width }}
      onPointerDown={() => handlePress("down")}
      onPointerUp={() => handlePress("up")}
      onPointerLeave={() => setPressed(false)}
    >
      <div
        className="relative overflow-hidden transition-all duration-75"
        style={{
          width,
          height: 52,
          transform: pressed ? "translateY(2px) scale(0.96)" : "translateY(0) scale(1)",
        }}
      >
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            backgroundColor: isAccent ? colors.accent : colors.primary,
            boxShadow: pressed
              ? "inset 0 2px 4px rgba(0,0,0,0.3)"
              : "inset 0 1px 1px rgba(255,255,255,0.05), 0 4px 8px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)",
          }}
        />
        <div
          className="relative z-10 h-full flex flex-col items-center justify-center"
          style={{ width: width - 8, margin: "0 4px" }}
        >
          {icon}
          {label && (
            <span
              className="text-xs font-medium select-none"
              style={{
                color: isAccent ? "#1f2937" : colors.text,
              }}
            >
              {label}
            </span>
          )}
          {secondaryLabel && (
            <span
              className="text-[10px] font-medium select-none"
              style={{
                color: isAccent ? "#1f2937" : colors.textDark,
              }}
            >
              {secondaryLabel}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function Keyboard({
  className,
  theme = "classic",
  enableHaptics = true,
  enableSound = true,
  soundUrl = "/sounds/sound.ogg",
  onKeyEvent,
}: KeyboardProps) {
  React.useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      onKeyEvent?.({ code: e.code, phase: "down", source: "physical" })
    }

    const handlePhysicalKeyUp = (e: KeyboardEvent) => {
      onKeyEvent?.({ code: e.code, phase: "up", source: "physical" })
    }

    window.addEventListener("keydown", handlePhysicalKeyDown)
    window.addEventListener("keyup", handlePhysicalKeyUp)

    return () => {
      window.removeEventListener("keydown", handlePhysicalKeyDown)
      window.removeEventListener("keyup", handlePhysicalKeyUp)
    }
  }, [onKeyEvent])

  const rowClass = "flex items-center gap-1.5"

  return (
    <div
      className={cn(
        "bg-[#0f1115] rounded-2xl p-6 sm:p-8 max-w-[900px] mx-auto shadow-2xl",
        className
      )}
    >
      <div className="bg-[#1a1d23] rounded-xl p-3 sm:p-4">
        <div className="space-y-1.5">
          <div className={rowClass}>
            <Key
              code="Escape"
              label="esc"
              isAccent
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <div className="w-4" />
            <Key
              code="F1"
              label="F1"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F2"
              label="F2"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F3"
              label="F3"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F4"
              label="F4"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <div className="w-6" />
            <Key
              code="F5"
              label="F5"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F6"
              label="F6"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F7"
              label="F7"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F8"
              label="F8"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <div className="w-6" />
            <Key
              code="F9"
              label="F9"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F10"
              label="F10"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F11"
              label="F11"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="F12"
              label="F12"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Delete"
              label="del"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
          </div>

          <div className={rowClass}>
            <Key
              code="Backquote"
              label="`"
              secondaryLabel="~"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit1"
              label="1"
              secondaryLabel="!"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit2"
              label="2"
              secondaryLabel="@"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit3"
              label="3"
              secondaryLabel="#"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit4"
              label="4"
              secondaryLabel="$"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit5"
              label="5"
              secondaryLabel="%"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit6"
              label="6"
              secondaryLabel="^"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit7"
              label="7"
              secondaryLabel="&"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit8"
              label="8"
              secondaryLabel="*"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit9"
              label="9"
              secondaryLabel="("
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Digit0"
              label="0"
              secondaryLabel=")"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Minus"
              label="-"
              secondaryLabel="_"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Equal"
              label="="
              secondaryLabel="+"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Backspace"
              label="backspace"
              width={112}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
          </div>

          <div className={rowClass}>
            <Key
              code="Tab"
              label="tab"
              width={84}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyQ"
              label="Q"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyW"
              label="W"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyE"
              label="E"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyR"
              label="R"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyT"
              label="T"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyY"
              label="Y"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyU"
              label="U"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyI"
              label="I"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyO"
              label="O"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyP"
              label="P"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="BracketLeft"
              label="["
              secondaryLabel="{"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="BracketRight"
              label="]"
              secondaryLabel="}"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Backslash"
              label="\"
              secondaryLabel="|"
              width={84}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
          </div>

          <div className={rowClass}>
            <Key
              code="CapsLock"
              label="caps"
              width={98}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyA"
              label="A"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyS"
              label="S"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyD"
              label="D"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyF"
              label="F"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyG"
              label="G"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyH"
              label="H"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyJ"
              label="J"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyK"
              label="K"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyL"
              label="L"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Semicolon"
              label=";"
              secondaryLabel=":"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Quote"
              label="'"
              secondaryLabel='"'
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Enter"
              label="enter"
              width={126}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
          </div>

          <div className={rowClass}>
            <Key
              code="ShiftLeft"
              label="shift"
              width={126}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyZ"
              label="Z"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyX"
              label="X"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyC"
              label="C"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyV"
              label="V"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyB"
              label="B"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyN"
              label="N"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="KeyM"
              label="M"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Comma"
              label=","
              secondaryLabel="<"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Period"
              label="."
              secondaryLabel=">"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Slash"
              label="/"
              secondaryLabel="?"
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="ShiftRight"
              label="shift"
              width={98}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
          </div>

          <div className={rowClass}>
            <Key
              code="ControlLeft"
              label="ctrl"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="MetaLeft"
              label="win"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="AltLeft"
              label="alt"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Space"
              label=""
              width={336}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="AltRight"
              label="alt"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="Fn"
              label="fn"
              width={56}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="MetaRight"
              label="menu"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <Key
              code="ControlRight"
              label="ctrl"
              width={70}
              theme={theme}
              onKeyEvent={onKeyEvent}
              enableHaptics={enableHaptics}
              enableSound={enableSound}
              soundUrl={soundUrl}
            />
            <div className="flex flex-col items-center gap-1.5 ml-2">
              <Key
                code="ArrowUp"
                label="↑"
                width={48}
                theme={theme}
                onKeyEvent={onKeyEvent}
                enableHaptics={enableHaptics}
                enableSound={enableSound}
                soundUrl={soundUrl}
              />
              <div className="flex gap-1.5">
                <Key
                  code="ArrowLeft"
                  label="←"
                  width={48}
                  theme={theme}
                  onKeyEvent={onKeyEvent}
                  enableHaptics={enableHaptics}
                  enableSound={enableSound}
                  soundUrl={soundUrl}
                />
                <Key
                  code="ArrowDown"
                  label="↓"
                  width={48}
                  theme={theme}
                  onKeyEvent={onKeyEvent}
                  enableHaptics={enableHaptics}
                  enableSound={enableSound}
                  soundUrl={soundUrl}
                />
                <Key
                  code="ArrowRight"
                  label="→"
                  width={48}
                  theme={theme}
                  onKeyEvent={onKeyEvent}
                  enableHaptics={enableHaptics}
                  enableSound={enableSound}
                  soundUrl={soundUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Keyboard }
