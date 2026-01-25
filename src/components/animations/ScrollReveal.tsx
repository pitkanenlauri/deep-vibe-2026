import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleUp,
  staggerContainer,
  staggerItem
} from './variants';

type AnimationType = 'fadeUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleUp' | 'staggerContainer' | 'staggerItem';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationType;
  className?: string;
  delay?: number;
  once?: boolean;
  margin?: string;
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'aside' | 'main';
}

const animationVariants: Record<AnimationType, Variants> = {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleUp,
  staggerContainer,
  staggerItem
};

export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  className = '',
  delay = 0,
  once = true,
  margin = '-80px',
  as = 'div'
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = animationVariants[animation];

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const MotionComponent = motion[as];

  // Apply delay if specified
  const modifiedVariants: Variants = delay > 0
    ? {
        ...variants,
        visible: {
          ...(typeof variants.visible === 'object' ? variants.visible : {}),
          transition: {
            ...(typeof variants.visible === 'object' && variants.visible.transition
              ? variants.visible.transition
              : {}),
            delay
          }
        }
      }
    : variants;

  return (
    <MotionComponent
      variants={modifiedVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// Export individual reveal components for convenience
export function FadeUp({ children, className, delay, once, margin }: Omit<ScrollRevealProps, 'animation' | 'as'>) {
  return (
    <ScrollReveal animation="fadeUp" className={className} delay={delay} once={once} margin={margin}>
      {children}
    </ScrollReveal>
  );
}

export function FadeIn({ children, className, delay, once, margin }: Omit<ScrollRevealProps, 'animation' | 'as'>) {
  return (
    <ScrollReveal animation="fadeIn" className={className} delay={delay} once={once} margin={margin}>
      {children}
    </ScrollReveal>
  );
}

export function SlideInLeft({ children, className, delay, once, margin }: Omit<ScrollRevealProps, 'animation' | 'as'>) {
  return (
    <ScrollReveal animation="slideInLeft" className={className} delay={delay} once={once} margin={margin}>
      {children}
    </ScrollReveal>
  );
}

export function SlideInRight({ children, className, delay, once, margin }: Omit<ScrollRevealProps, 'animation' | 'as'>) {
  return (
    <ScrollReveal animation="slideInRight" className={className} delay={delay} once={once} margin={margin}>
      {children}
    </ScrollReveal>
  );
}

export function ScaleUp({ children, className, delay, once, margin }: Omit<ScrollRevealProps, 'animation' | 'as'>) {
  return (
    <ScrollReveal animation="scaleUp" className={className} delay={delay} once={once} margin={margin}>
      {children}
    </ScrollReveal>
  );
}

// Stagger container for animating groups of children
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  margin?: string;
}

export function StaggerContainer({ children, className, once = true, margin = '-80px' }: StaggerContainerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item - use inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
