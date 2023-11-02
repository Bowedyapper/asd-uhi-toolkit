import gsap from 'gsap';

const inputRedTimeline = gsap.timeline({ paused: true });

export const inputRed = (id: string): void => {
  inputRedTimeline.restart();
  gsap.to(id, {
    borderColor: 'red',
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderRadius: '0.45rem',
    duration: 0.1
  });

  gsap.to(id, {
    borderTopWidth: '1px',
    borderRightWidth: '1px',
    borderBottomWidth: '1px',
    borderLeftWidth: '1px',
    borderColor: 'rgb(107 114 128)',
    duration: 0.1,
    delay: 2
  });

  inputRedTimeline.fromTo(
    id,
    {
      x: -5
    },
    {
      x: 5,
      duration: 0.07,
      repeat: 2,
      yoyo: true,
      onComplete: () => {
        inputRedTimeline.reverse();
      }
    },
    '-=0.107'
  );

  inputRedTimeline.to(id, {
    x: 0,
    delay: 3
  });

  inputRedTimeline.play();
};
