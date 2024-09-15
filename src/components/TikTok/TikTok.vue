<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const {
  videoId,
  isRepeatedly = false,
  isAutoPlay = false,
  showControls = true,
  showProgressBar = true,
  showPlay = true,
  showVolumeControl = true,
  showFullscreen = true,
  showTimestamp = true,
  showMusicInfo = false,
  showDescription = false,
  showRelatedVideos = true,
  showNativeContextMenu = true
} = defineProps<{
  videoId: string
  isRepeatedly?: boolean
  isAutoPlay?: boolean
  showControls?: boolean
  showProgressBar?: boolean
  showPlay?: boolean
  showVolumeControl?: boolean
  showFullscreen?: boolean
  showTimestamp?: boolean
  showMusicInfo?: boolean
  showDescription?: boolean
  showRelatedVideos?: boolean
  showNativeContextMenu?: boolean
}>()
const videoInfo = ref({})
const mapperParams = computed(() => {
  const mapperParams = {
    loop: isRepeatedly ? '1' : '0',
    autoplay: isAutoPlay ? '1' : '0'
    /*     showControls: showControls ? 'controls=1' : 'controls=0',
    showProgressBar: showProgressBar ? 'progress_bar=1' : 'progress_bar=0',
    showPlay: showPlay ? 'play_button=1' : 'play_button=0',
    showVolumeControl: showVolumeControl ? 'volume_control=1' : 'volume_control=0',
    showFullscreen: showFullscreen ? 'fullscreen_button=1' : 'fullscreen_button=0',
    showTimestamp: showTimestamp ? 'timestamp=1' : 'timestamp=0',
    showMusicInfo: showMusicInfo ? 'music_info=1' : 'music_info=0',
    showDescription: showDescription ? 'description=1' : 'description=0',
    showRelatedVideos: showRelatedVideos ? 'rel=1' : 'rel=0',
    showNativeContextMenu: showNativeContextMenu ? 'native_context_menu=1' : 'native_context_menu=0' */
  }
  return new URLSearchParams(mapperParams)
})
/* const fetchVideo = async () => {
  try {
    const getInfo = await fetch(`${url}&${mapperParams.value?.toString()}`)
    const data = await getInfo.json()
    videoInfo.value = data
  } catch (error) {
    console.error(error)
  }
} */

enum PlayerState {
  INIT = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3
}

interface OnPlayerReadyMessage {
  type: 'onPlayerReady'
  value: null
}

interface OnStateChangeMessage {
  type: 'onStateChange'
  value: PlayerState
}

interface onCurrentTimeMessage {
  type: 'onCurrentTime'
  value: number
}

interface onMuteMessage {
  type: 'onMute'
  value: boolean
}

type Range<
  Start extends number,
  End extends number,
  Result extends Array<unknown> = []
> = Result['length'] extends End
  ? Start | Result['length']
  : Range<Start, End, [unknown, ...Result]>

interface onVolumeChangeMessage {
  type: 'onVolumeChange'
  value: Range<0, 100>
}

interface onErrorMessage {
  type: 'onError'
  // LINK https://developer.mozilla.org/en-US/docs/Web/API/MediaError/code
  value: MediaError['code']
}

interface onImageChange {
  type: 'onImageChange'
  value: number
}

// União dos tipos de mensagem
type TikTokMessage =
  | OnPlayerReadyMessage
  | OnStateChangeMessage
  | onCurrentTimeMessage
  | onMuteMessage
  | onVolumeChangeMessage
  | onErrorMessage
  | onImageChange

// Agora você pode aplicar isso na interface
interface EmbeddedPlayerMessage<T extends TikTokMessage> {
  'x-tiktok-player': boolean // Para saber que é uma mensagem do TikTok
  value: T['value'] // O tipo de valor depende do tipo de mensagem
  type: T['type'] // Define o tipo de mensagem
}

const emits = defineEmits([
  'onPlayerReady',
  'onStateChange',
  'onCurrentTime',
  'onMute',
  'onVolumeChange',
  'onError',
  'onImageChange'
])

const prepareMessagesListener = () => {
  window.addEventListener(
    'message',
    (event) => {
      const data = event.data as EmbeddedPlayerMessage<TikTokMessage>
      const isFromTikTok = event.origin === 'https://www.tiktok.com' && data['x-tiktok-player']
      if (!isFromTikTok) return
      if (data.type === 'onPlayerReady') emits('onPlayerReady')
      if (data.type === 'onStateChange') emits('onStateChange', data.value)
      if (data.type === 'onCurrentTime') emits('onCurrentTime', data.value)
      if (data.type === 'onMute') emits('onMute', data.value)
      if (data.type === 'onVolumeChange') emits('onVolumeChange', data.value)
      if (data.type === 'onError') emits('onError', data.value)
      if (data.type === 'onImageChange') emits('onImageChange', data.value)
    },
    false
  )
}

onMounted(() => {
  prepareMessagesListener()
})
</script>

<template>
  <iframe
    :src="` https://www.tiktok.com/player/v1/${videoId}?${mapperParams.toString()}`"
    frameborder="0"
    scrolling="no"
    allowfullscreen
  ></iframe>
</template>
