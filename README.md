Email:caro1xxxhv@gmail.com

### Eng

*Currently in beta, please do not use for work projects*

### Zh
*目前还处于开发测试阶段,请勿用于工作项目中*

### Download

```bash
npm install react-customize-player
```

### Use

#### introduce

```js
import { ReactVideoPlayer } from 'react-customize-player'
```

> **Note: If you don't need a particular configuration item, then write it anyway, but just don't give a value**

#### using

Recommended settings are *not less than 300px in height and width*

```react
//Custom Height Width
<ReactVideoPlayer high="520px" long="800px" />
//or
<ReactVideoPlayer high="calc(100vh)" long="calc(100vw)" />
```

```tsx
//You must pass in the video link
<ReactVideoPlayer ...  videoUrl="Your video url"   />
```

#### Turn on thumbnails

minVideoUrl must be a *compressed* video, otherwise it will cause users to repeat requests for high quality video, minVideoUrl is only used to display thumbnails

```tsx
<ReactVideoPlayer ...  minVideoUrl="Links to compressed videos"   />
```

close minVideo

```tsx
//Just leave it blank
<ReactVideoPlayer ...  minVideoUrl=""   />
```

#### Color

Set the background fill color and the progress bar color

```tsx
//backgroundFillColor
<ReactVideoPlayer  .... backgroundFillColor="#cecece" />
//progressColor
<ReactVideoPlayer  .... progressColor="pink" />
//bufferColor
<ReactVideoPlayer  .... bufferColor="RGB(255,255,255)" />
```

#### Complete

```js
high: string;
long: string;
videoUrl: string;
minVideoUrl?: string;  //turn off  -> minVideoUrl=''
bufferColor?: string; //turn off  -> bufferColor=''
progressColor?: string;  //turn off  -> progressColor=''
backgroundFillColor?: string; //turn off  -> backgroundFillColor=''
```

