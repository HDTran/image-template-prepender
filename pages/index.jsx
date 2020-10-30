import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const cheerio = require('cheerio');

const INITIAL_HTML = '<div data-w-id="a1c3d1ea-0b0d-0060-0b74-fc4634ed5369" class="image-wrapper"><img src="images/IMG_8639_2.jpg" sizes="(max-width: 767px) 93vw, (max-width: 991px) 600px, (max-width: 1439px) 94vw, 1236px" srcset="images/IMG_8639_2-p-500.jpeg 500w, images/IMG_8639_2-p-800.jpeg 800w, images/IMG_8639_2-p-1080.jpeg 1080w, images/IMG_8639_2-p-1600.jpeg 1600w, images/IMG_8639_2.jpg 1671w" alt="" class="image-zoom"></div>';

const Home = () => {
  const [text, setText] = useState(INITIAL_HTML);
  const [replaceText, setReplaceText] = useState('Webflow-Radio');
  const [replacedText, setReplacedText] = useState('');

  const updateReplacedText = ({ haystack, replace } = {}) => {
    const haystackText = haystack || text;
    const replacingText = replace ? `${replace}/` : `${replaceText}/`;
    const $ = cheerio.load(haystackText);

    $('img').each(function () {
      const src = $(this).attr('src');
      if (src) {
        $(this).attr(
          'src',
          `<%=image_path('${src.replaceAll('images/', replacingText)}')%>`,
        );
      }

      const srcset = $(this).attr('srcset');
      if (srcset) {
        const images = srcset.split(',');
        const replaced = images.map((image) => {
          if (image.trim().indexOf('images/') === 0) {
            const srcsetParts = image.trim().split(' ');

            return `<%=image_path('${srcsetParts[0]
              .trim()
              .replace('images/', replacingText)}')%> ${srcsetParts[1]}`;
          }
          return image;
        }).join(', ');
        $(this).attr('srcset', replaced);
      }
    });

    const finishedText = $('body')
      .html()
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&apos;', "'");
    setReplacedText(finishedText);
  };

  const handleInputHTML = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    updateReplacedText({ haystack: inputText });
  };

  const handleReplaceChange = (e) => {
    const inputText = e.target.value;
    setReplaceText(inputText);
    updateReplacedText({ replace: inputText });
  };

  useEffect(() => { updateReplacedText(); }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Template Prepender</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Image to Template Prepender</h1>

        <p className={styles.description}>
          Get started by pasting HTML into the input to get back a response with
          {' '}
          <span className={styles.code}>{"<%=image_path('{replace}/')%>"}</span>
        </p>

        <div>
          <p>Input HTML</p>
          <textarea
            onChange={handleInputHTML}
            placeholder={
              '<div data-w-id="a1c3d1ea-0b0d-0060-0b74-fc4634ed5369" class="image-wrapper"><img src="images/IMG_8639_2.jpg" sizes="(max-width: 767px) 93vw, (max-width: 991px) 600px, (max-width: 1439px) 94vw, 1236px" srcset="images/IMG_8639_2-p-500.jpeg 500w, images/IMG_8639_2-p-800.jpeg 800w, images/IMG_8639_2-p-1080.jpeg 1080w, images/IMG_8639_2-p-1600.jpeg 1600w, images/IMG_8639_2.jpg 1671w" alt="" class="image-zoom"></div>'
            }
            value={text}
            style={{ height: 300, width: 750 }}
          />
        </div>

        <div>
          <p>
            Replace
            {' '}
            <span className={styles.code}>images/</span>
            {' '}
            with
          </p>
          <input
            onChange={handleReplaceChange}
            placeholder="Webflow-Radio/"
            value={replaceText}
            style={{ width: 750 }}
          />
        </div>

        <div className={styles.code__area}>
          <textarea
            className={styles.code}
            value={replacedText}
            readOnly
            style={{ height: 300, width: 750 }}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
