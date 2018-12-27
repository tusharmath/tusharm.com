```metadata
title: How to configure windows on Mac (retina) using virtual box

date: 2013-07-09
template: article.pug
```

You don't have any money left to buy Parallels or Fusion so you are stuck up with Virtual box for the time being. Virtual box unfortunately does not provide a support for retina displays (At the time of writing this document).

You will keep trying out different resolutions and will still not be satisfied because sometimes the content would be too stretched in the horizontal direction and sometimes in the vertical direction. You might then have to use a really low resolution which would look and feel pathetic !

<span class="more"/>

So here are some steps that you could try out to improve your user experience with Virtual Box till the time they don't provide you with actual retina support.

**Step 1.**
Determine the number of pixels on your screen. For e.g.- Mac pro 13" and 15" Retina have 2560 by 1600 pixels.

**Step 2.**
The VM will respect the resolutions properly only in Scale mode. In scale mode the VM is viewed in a window. A window will not take-up the complete screen. So you need to get the maximum size that a window can take up on your screen (Without going into fullscreen mode).

What I really mean by that statement is - out of the 2560x1400 px of real estate available on the screen only 2560x700 px can be used by a window to show content. Why ? Because I have a dock at the bottom and a menu bar at the top which takes up some space vertically. So in this step you need to calculate that space. Here is how I did it.

I personally used the **⌘ + ⇧ + 4** button to take a snapshot of the window and then see the resolution of the image file. So in my particular case I have the dock in the bottom so I need to compromise the height of the screen. Rounding off to the nearest integer the available real estate of a window comes out to be 2560x1400.

**Step 3.**
Now you need to setup this custom resolution on your VM. So keep the VM on and run the following command on your terminal

```bash
$ VBoxManage controlvm [VM name] setvideomodehint [Width] [Height] 32
```

For e.g. if you want to try this on a mac pro 13" retina

```bash
$ VBoxManage controlvm Win7 setvideomodehint 2560 1400 32
```

**Step 4.**
This would be a really high resolution and you will not be able to read anything on the VM because the text would be really small. So now go to your VM with win7 installed and follow these steps -

1. Open display settings.
2. Click on [Set custom size DPI] from the right hand side Navigation Bar.
3. Scale the font size to 200%.
4. Click ok, Log off and Login again.

Voila! you will definitely have a better Win7 experience on Mac now.
