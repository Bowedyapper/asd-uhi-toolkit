<script lang="ts">
  import uhiLogo from '$assets/uhi.png';
  import { onMount, onDestroy } from 'svelte';
  import rendererLogger from '$lib/helpers/logger';
  import gsap from 'gsap';

  const timeline = gsap.timeline();
  onMount(() => {
    // Set the date we're counting down to
    let countDownDate = new Date('May 6, 2024 15:59:59').getTime();

    // Update the countdown every 1 second
    let x = setInterval(function () {
      // Get the current date and time
      let now = new Date().getTime();

      // Calculate the distance between now and the countdown date
      let distance = countDownDate - now;

      // Calculate days, hours, minutes, and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) ;
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the countdown
      document.getElementById('countdown').innerHTML =
        days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's ';

      // If the countdown is over, display a message
      if (distance < 0) {
        clearInterval(x);
        document.getElementById('countdown').innerHTML = 'EXPIRED';
      }
    }, 1000);

    rendererLogger.silly('LogoHeader.svelte mounted');
    timeline.from('#uhi-logo', {
      autoAlpha: 0,
      duration: 1
    });

    timeline.from(
      '#app-text',
      {
        autoAlpha: 0,
        duration: 1,
        stagger: 1
      },
      '-=1'
    );
  });

  onDestroy(() => {
    rendererLogger.silly('LogoHeader.svelte destroyed');
  });
</script>

<div
  class="w-full ml-8 flex flex-row relative float-left justify-center items-center text-white h-24"
>
  <div class="flex flex-row justify-center items-center">
    <img id="uhi-logo" class="h-10 w-auto" src={uhiLogo} alt="UHI Logo" />
    <p id="app-text" class="font-light ml-4">Applied Software Development Toolkit</p>
  </div>
  <div class="flex flex-row flex-1 justify-end">
    <p class="font-semibold text-sm">Semester 2 Deadline: </p>
    <p class="float-right text-sm" id="countdown"></p>
  </div>
</div>
