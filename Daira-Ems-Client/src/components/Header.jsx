import { Fragment, useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { CgProfile, CgSize } from 'react-icons/cg';
import { Container } from '../components/Container';
import NavItemWithDropdown from './NavbarDropDown';
import { useUserAuth } from '../pages/user/auth/userAuth';
function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg viewBox="0 0 8 6" aria-hidden="true" {...props}>
      <path
        d="M1.75 1.75 4 4.25l2.25-2.5"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// eslint-disable-next-line react/prop-types
function MobileNavItem({ href, children, onClick }) {
  const handleClick = () => {
    onClick();
  };

  return (
    <li onClick={handleClick} className="py-2">
      <Link to={href} className="block px-4">
        {children}
      </Link>
    </li>
  );
}

function MobileNavigation(props) {
  const isLoggedIn = Boolean(localStorage.getItem('userData'));
  const { logout } = useUserAuth();
  const navigate = useNavigate();
  const closeButtonRef = useRef(null);

  const handleClickCloseButton = () => {
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };

  const closePopover = () => {
    handleClickCloseButton();
  };

  return (
    <Popover {...props}>
      <Popover.Button className="group flex items-center rounded-full  px-4 py-2 text-sm font-medium  shadow-lg shadow-zinc-800/5 ring-1  backdrop-blur bg-zinc-800/text-zinc-200 ring-white/10 hover:ring-white/20">
        <span className="text-orange-500">Menu</span>
        <ChevronDownIcon className="ml-3 h-auto w-2 stroke-zinc-500  group-hover:stroke-zinc-400" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 backdrop-blur-sm bg-black/80" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            focus
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl  p-8 ring-1 ring-zinc-900/5 bg-zinc-900 ring-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button
                ref={closeButtonRef}
                aria-label="Close menu"
                className="-m-1 p-1"
              >
                <CloseIcon className="h-6 w-6  text-zinc-400" />
              </Popover.Button>
              <h2 className="text-sm font-medium  text-zinc-400">DAIRA'25</h2>
            </div>
            <nav className="mt-6">
              <ul className="-my-2 divide-y divide-zinc-100 text-base divide-zinc-100/5 text-zinc-300">
                <MobileNavItem href="/home" onClick={closePopover}>
                  Home
                </MobileNavItem>
                <MobileNavItem href="/rule-book" onClick={closePopover}>
                  GuideBook
                </MobileNavItem>
                <MobileNavItem href="/socials" onClick={closePopover}>
                  Socials
                </MobileNavItem>
                <MobileNavItem href="/categories" onClick={closePopover}>
                  Events
                </MobileNavItem>
                <MobileNavItem href="/schedule" onClick={closePopover}>
                  Schedule
                </MobileNavItem>
                <MobileNavItem href="/sponsors" onClick={closePopover}>
                  Sponsors
                </MobileNavItem>
                <MobileNavItem href="/meet-the-team" onClick={closePopover}>
                  Meet The Team
                </MobileNavItem>
                {/* <MobileNavItem href="/register" onClick={closePopover}>
                  Register
                </MobileNavItem> */}
                <MobileNavItem href="/ambassador" onClick={closePopover}>
                  Ambassador List
                </MobileNavItem>
                <MobileNavItem href="/ambassadors-perks" onClick={closePopover}>
                  Ambassador Perks
                </MobileNavItem>
                <MobileNavItem
                  href="/ambassador-application"
                  onClick={closePopover}
                >
                  Ambassador Application
                </MobileNavItem>
                {/* <MobileNavItem href="/schedule" onClick={closePopover}>
                  Schedule
                </MobileNavItem>
                <MobileNavItem href="/bus-schedule" onClick={closePopover}>
                  Bus Schedule
                </MobileNavItem> */}
                {/* <MobileNavItem href="/about-us" onClick={closePopover}>
                  About Us
                </MobileNavItem> */}
                {isLoggedIn ? (
                  <>
                    <MobileNavItem
                      href="/ambassador/dashboard"
                      onClick={closePopover}
                    >
                      Dashboard
                    </MobileNavItem>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                        navigate('/login');
                      }}
                      className="w-full pt-3 pr-3 pb-3 text-white text-left font-medium  hover:text-orange-500 dark:hover:text-orange-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <MobileNavItem href="/login" onClick={closePopover}>
                    Login
                  </MobileNavItem>
                )}
              </ul>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

// eslint-disable-next-line react/prop-types
function NavItem({ href, children }) {
  let isActive = useLocation().pathname === href;

  return (
    <li>
      <Link
        to={href}
        className={clsx(
          'relative block px-3 py-4 transition text-base font-medium ease-in-out transform hover:scale-105 text-white',
          isActive ? 'font-bold ' : 'hover:font-bold '
        )}
      >
        {children}
        {isActive && (
          <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-teal-500/0 via-teal-500/40 to-teal-500/0 dark:from-teal-400/0 dark:via-teal-400/40 dark:to-teal-400/0" />
        )}
      </Link>
    </li>
  );
}

function DesktopNavigation(props) {
  const isLoggedIn = Boolean(localStorage.getItem('userData'));
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  return (
    <nav {...props}>
      <ul className="flex rounded-full px-3 font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 backdrop-blur bg-gradient-to-r from-[#6d1538] to-[#000000] dark:text-zinc-200 ring-white/10 w-full">
        <NavItem href="/home">Home</NavItem>
        <NavItem href="/rule-book">GuideBook</NavItem>
        <NavItem href="/socials">Socials</NavItem>
        <NavItem href="/categories">Events</NavItem>
        <NavItem href="/schedule">Schedule</NavItem>
        <NavItem href="/sponsors">Sponsors</NavItem>
        <NavItem href="/meet-the-team">Team</NavItem>

        {/* <NavItemWithDropdown title="Schedule">
          <ul className="absolute z-10 left-0 mt-2 bg-[#3C3C3F] shadow-lg ring-1 ring-zinc-900/5 w-48">
            <li className="py-1 px-3 ">
              <NavItem href="/schedule">Event Schedule</NavItem>
            </li>
            <li className="py-1 px-3 ">
              <NavItem href="/bus-schedule">Buses Schedule</NavItem>
            </li>
          </ul>
        </NavItemWithDropdown> */}
        <NavItemWithDropdown title="Ambassador">
          <ul className="absolute z-10 left-0 mt-2 bg-[#111111] shadow-lg ring-1 ring-zinc-900/5 w-48">
            <li className="py-1 px-3 ">
              <NavItem href="/ambassador">Ambassador List</NavItem>
            </li>
            <li className="py-1 px-3 ">
              <NavItem href="/ambassadors-perks">Ambassador Perks</NavItem>
            </li>
            <li className="py-1 px-3 ">
              <NavItem href="/ambassador-application">
                Ambassador Application
              </NavItem>
            </li>
          </ul>
        </NavItemWithDropdown>
        {/* <NavItem href="/about-us">About</NavItem> */}

        {isLoggedIn ? (
          <>
            <NavItem href="/ambassador/dashboard">Dashboard</NavItem>
            <NavItemWithDropdown
              title={
                <CgProfile
                  size={24}
                  style={{ display: 'block', margin: 'auto' }}
                />
              }
            >
              <ul className="absolute z-10 left-0 mt-2 bg-[#3C3C3F] shadow-lg ring-1 ring-zinc-900/5 w-48">
                {/* <li className="py-1 px-3 ">
                  <NavItem href="/user-profile">Profile</NavItem>
                </li> */}
                <li className="py-1 px-3 ">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      navigate('/login');
                    }}
                    className="w-full p-3 text-white text-base text-left font-medium  hover:text-orange-500 white:hover:text-orange-500"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </NavItemWithDropdown>
          </>
        ) : (
          <>
            <NavItem href="/login">Register</NavItem>
          </>
        )}
      </ul>
    </nav>
  );
}

function clamp(number, a, b) {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
}

// eslint-disable-next-line react/prop-types
function Header() {
  let isHomePage = window.location.pathname === '/';

  let headerRef = useRef();
  let avatarRef = useRef();
  let isInitial = useRef(true);

  useEffect(() => {
    let downDelay = avatarRef.current?.offsetTop ?? 0;
    let upDelay = 64;

    function setProperty(property, value) {
      document.documentElement.style.setProperty(property, value);
    }

    function removeProperty(property) {
      document.documentElement.style.removeProperty(property);
    }

    function updateHeaderStyles() {
      let { top, height } = headerRef.current.getBoundingClientRect();
      let scrollY = clamp(
        window.scrollY,
        0,
        document.body.scrollHeight - window.innerHeight
      );

      if (isInitial.current) {
        setProperty('--header-position', 'sticky');
      }

      setProperty('--content-offset', `${downDelay}px`);

      if (isInitial.current || scrollY < downDelay) {
        setProperty('--header-height', `${downDelay + height}px`);
        setProperty('--header-mb', `${-downDelay}px`);
      } else if (top + height < -upDelay) {
        let offset = Math.max(height, scrollY - upDelay);
        setProperty('--header-height', `${offset}px`);
        setProperty('--header-mb', `${height - offset}px`);
      } else if (top === 0) {
        setProperty('--header-height', `${scrollY + height}px`);
        setProperty('--header-mb', `${-scrollY}px`);
      }

      if (top === 0 && scrollY > 0 && scrollY >= downDelay) {
        setProperty('--header-inner-position', 'fixed');
        removeProperty('--header-top');
        removeProperty('--avatar-top');
      } else {
        removeProperty('--header-inner-position');
        setProperty('--header-top', '0px');
        setProperty('--avatar-top', '0px');
      }
    }

    function updateAvatarStyles() {
      if (!isHomePage) {
        return;
      }

      let fromScale = 1;
      let toScale = 36 / 64;
      let fromX = 0;
      let toX = 2 / 16;

      let scrollY = downDelay - window.scrollY;

      let scale = (scrollY * (fromScale - toScale)) / downDelay + toScale;
      scale = clamp(scale, fromScale, toScale);

      let x = (scrollY * (fromX - toX)) / downDelay + toX;
      x = clamp(x, fromX, toX);

      setProperty(
        '--avatar-image-transform',
        `translate3d(${x}rem, 0, 0) scale(${scale})`
      );

      let borderScale = 1 / (toScale / scale);
      let borderX = (-toX + x) * borderScale;
      let borderTransform = `translate3d(${borderX}rem, 0, 0) scale(${borderScale})`;

      setProperty('--avatar-border-transform', borderTransform);
      setProperty('--avatar-border-opacity', scale === toScale ? 1 : 0);
    }

    function updateStyles() {
      updateHeaderStyles();
      updateAvatarStyles();
      isInitial.current = false;
    }

    updateStyles();
    window.addEventListener('scroll', updateStyles, { passive: true });
    window.addEventListener('resize', updateStyles);

    return () => {
      window.removeEventListener('scroll', updateStyles, { passive: true });
      window.removeEventListener('resize', updateStyles);
    };
  }, [isHomePage]);

  return (
    <>
      <header
        className="pointer-events-none relative z-50 flex flex-col"
        style={{
          height: 'var(--header-height)',
          width: '100%',
        }}
      >
        {isHomePage && (
          <>
            <div
              ref={avatarRef}
              className="order-last mt-[calc(theme(spacing.16)-theme(spacing.3))]"
            />
          </>
        )}
        <div
          ref={headerRef}
          className="top-0 z-10 h-16 pt-6"
          style={{ position: 'var(--header-position)' }}
        >
          <Container
            className="top-[var(--header-top,theme(spacing.6))] w-full"
            style={{ position: 'var(--header-inner-position)' }}
          >
            <div className="relative flex gap-4">
              <div className="flex flex-1">
                {/* {!isHomePage && (
                  <AvatarContainer>
                    <Avatar />
                  </AvatarContainer>
                )} */}
              </div>
              <div className="flex flex-1 justify-end md:justify-center">
                <MobileNavigation className="pointer-events-auto md:hidden" />
                <DesktopNavigation className="pointer-events-auto hidden md:block" />
              </div>
              <div className="flex justify-end md:flex-1">
                <div className="pointer-events-auto">
                  {/* <ModeToggle /> */}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>
      {isHomePage && <div style={{ height: 'var(--content-offset)' }} />}
    </>
  );
}

export { Header };
