<script lang="ts">
  import gsap from 'gsap';
  import { onMount } from 'svelte';
  import { animationSpeed, studentInfo, currentView } from '$lib/stores/main';
  import isValidRepo from '$lib/functions/isValidRepo';
  import addToast from '$lib/functions/toasts';
  import { inputRed } from '$lib/functions/inputRedShake';
  import spinner from '$assets/spinner.svg?asset';

  export let onAnimComplete: () => void = () => {};
  export let onAnimReverseComplete: () => void = () => {};

  export const componentTimeline = gsap.timeline({
    onComplete: onAnimComplete,
    onReverseComplete: onAnimReverseComplete
  });
  const gitStatusTimeline = gsap.timeline().pause();
  $: $animationSpeed,
    ((): void => {
      componentTimeline.timeScale($animationSpeed);
    })();

  onMount(() => {
    gitStatusTimeline.from('#spinner', {
      autoAlpha: 0,
      duration: 0.5,
      onComplete: () => {
        gitStatusTimeline.pause();
      },
      onReverseComplete: () => {
        gitStatusTimeline.pause();
      }
    });

    componentTimeline.from('#add-repo-text', {
      autoAlpha: 0,
      //duration: 0.5,
      //stagger: 1,
      onReverseComplete: () => {
        currentView.set('IntroScreen');
      }
    });

    componentTimeline.to('#add-repo-text', {
      y: -50
    });

    componentTimeline.from('#git-input', {
      autoAlpha: 0,
      onComplete: () => {
        componentTimeline.pause();
      }
    });

    componentTimeline.to('#git-input', {
      x: -window.innerWidth * 2,
      duration: 1.5,
      onReverseComplete: () => {
        componentTimeline.pause();
        isGitInputDisabled = false;
      }
    });

    componentTimeline.to(
      '#add-repo-text',
      {
        autoAlpha: 0
      },
      '-=1.5'
    );

    componentTimeline.from('#select-user-text', {
      autoAlpha: 0
    });

    componentTimeline.from(
      '#git-username',
      {
        x: -window.innerWidth * 2,
        duration: 0.8,
        onComplete: () => {
          componentTimeline.pause();
        }
      },
      '-=0.5'
    );

    componentTimeline.from('#confirm-back', {
      autoAlpha: 0,
      onComplete: () => {
        componentTimeline.pause();
      }
    });

    componentTimeline.to('#select-user-text', {
      autoAlpha: 0
    });

    componentTimeline.to(
      '#git-username',
      {
        autoAlpha: 0,
        onReverseComplete: () => {
          componentTimeline.pause();
        }
      },
      '-=0.5'
    );

    componentTimeline.to(
      '#confirm-back',
      {
        autoAlpha: 0,
        onReverseComplete: () => {
          componentTimeline.pause();
        }
      },
      '-=0.5'
    );

    componentTimeline.from('#end-stage', {
      autoAlpha: 0
    });

    componentTimeline.from('#finish-setup-btns', {
      autoAlpha: 0,
      onComplete: () => {
        componentTimeline.pause();
      }
    });

    componentTimeline.to('#end-stage', {
      autoAlpha: 0
    });

    componentTimeline.to('#finish-setup-btns', {
      autoAlpha: 0,
      onComplete: () => {
        currentView.set('Progress');
      }
    });
  });

  $: gitInputValue = '';
  $: isGitInputDisabled = false;
  $: currentGitUsersList = [];
  $: selectedUser = '';
  $: gitLoaderText = '';

  const cloneRepo = async (): Promise<void> => {
    gitLoaderText = 'Cloning repo...';
    if (isValidRepo(gitInputValue)) {
      gitStatusTimeline.play();
      isGitInputDisabled = true;
      await window.electron.ipcRenderer
        .invoke('git-clone', gitInputValue)
        .then(async () => {
          gitLoaderText = 'Extracting users...';
          await getGitUsers(gitInputValue);
          gitStatusTimeline.reverse();
          componentTimeline.play();
        })
        .catch((err) => {
          console.log('Caught error:', err);
          gitLoaderText = 'Failed';
          gitStatusTimeline.reverse();
          isGitInputDisabled = false;
          inputRed('#git-input');
          addToast('Could not clone repository', 'error');
        });
    } else {
      console.log('\x1b[33m[addRepos] Not valid uri\x1b[0m');
      inputRed('#git-input');
      addToast('Not a valid git URI', 'error');
    }
  };

  const getGitUsers = async (repo: string): Promise<void> => {
    const users = await window.electron.ipcRenderer.invoke('get-git-users', repo)
    currentGitUsersList = users;
  };

  window.electron.ipcRenderer.on('git-progress', (_event, arg) => {
    gitLoaderText = (`${arg.stage.charAt(0).toUpperCase() + arg.stage.slice(1)} ${arg.progress}%`);
  });
</script>

<!-- eslint-disable @typescript-eslint/explicit-function-return-type-->
<!-- https://github.com/sveltejs/svelte/issues/4701 for info about svelte inline TS -->
<h1 class="absolute top bottom-8 left-8 font-bold text-2xl" id="year-of-study">
  Year {$studentInfo.year}
</h1>
<h1 class="absolute font-bold text-4xl" id="add-repo-text">Lets add some repos</h1>

<div id="git-input" class="w-[35rem] absolute mt-10">
  <input
    disabled={isGitInputDisabled}
    bind:value={gitInputValue}
    type="text"
    class="input input-bordered w-full text-center"
    aria-label="Input"
    placeholder="git@github.com:username/reponame.git"
    on:keypress={async (k) => {
      if (k.key === 'Enter') {
        k.preventDefault();
        cloneRepo();
      }
    }}
  />
</div>
<h1 class="absolute font-bold text-4xl pb-24" id="select-user-text">Who are you?</h1>
<div id="git-username" class="w-[35rem] absolute mt-10">
  <select
    bind:value={selectedUser}
    on:change={() => {
      componentTimeline.play();
    }}
    class="select select-bordered w-full text-center"
    aria-label="Select"
  >
    <option selected value="">Select a user</option>
    {#each currentGitUsersList as user}
      <option>{user.author_name} - {user.author_email}</option>
    {/each}
  </select>
</div>

<div id="confirm-back" class="absolute flex mt-48 gap-2">
  <button
    on:click={() => componentTimeline.reverse()}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Back
  </button>
  <button
    on:click={() => {
      componentTimeline.play();
      studentInfo.update((student) => ({
        ...student,
        repositories: [
          ...student.repositories,
          { url: gitInputValue, user: selectedUser.split(' -', 1)[0] }
        ]
      }));
    }}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Confirm
  </button>
</div>
<div id="spinner" class="absolute mt-96 flex flex-col items-center gap-3">
  <div>{gitLoaderText}</div>
  <img src={spinner} alt="spinner" class="w-12 h-auto" />
</div>

<h1 class="absolute font-bold text-4xl pb-" id="end-stage">Need to add more repos?</h1>
<div id="finish-setup-btns" class="absolute flex mt-32 gap-2">
  <button
    on:click={() => componentTimeline.restart()}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Add More!
  </button>
  <button
    on:click={() => {
      componentTimeline.play();
    }}
    type="button"
    class="xt-button py-2.5 px-3.5 text-sm rounded-md font-medium leading-snug tracking-wider uppercase text-gray-900 bg-gray-100 transition hover:bg-gray-200 active:bg-gray-300 on:bg-gray-200"
  >
    Finish Setup
  </button>
</div>
