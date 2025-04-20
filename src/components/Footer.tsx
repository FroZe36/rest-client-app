import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import rsLogo from '../../public/RSLogo.png';
import githubLink from '../../public/github.png';

const Footer = () => {
  return (
    <footer>
      <div className='footer__links'>
        <Link href='https://github.com/M-M-Band/rest-client-app'>
          <Image
            priority={true}
            width={50}
            height={50}
            src={githubLink}
            alt='githubLink'
          />
        </Link>
        <div className='footer__namedLinks'>
          <Link
            className='subtext'
            href='https://github.com/FroZe36'
          >
            Dan
          </Link>
          <Link
            className='subtext'
            href='https://github.com/katiegrigoreva'
          >
            Kate
          </Link>
          <Link
            className='subtext'
            href='https://github.com/AlexKabanau'
          >
            Alex
          </Link>
        </div>
      </div>
      <span className='subtext'>2025 The Rolling Scopes</span>
      <Link href='https://rs.school/'>
        <Image
          priority={true}
          width={50}
          height={50}
          src={rsLogo}
          alt='RSSchoolLogo'
        />
      </Link>
    </footer>
  );
};

export default Footer;
