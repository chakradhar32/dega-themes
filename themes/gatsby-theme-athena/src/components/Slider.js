/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/** @jsx jsx */
import React, { useEffect, useRef, useState } from 'react'; // eslint-disable-line no-unused-vars
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { jsx } from 'theme-ui';
import _ from 'lodash';
// import parseEditorJsData from '../../utils/parseEditorJsData';
// import addDefaultSrc from '../../utils/addDefaultSrc';
/**
 * TODO: Change PLaceholder Img to color
 * TODO: Add resize observer
 * TODO: Add fontsizes to other elements
 * TODO: Disabling the buttons for first and last buttons
 * TODO: Fix the resize issue on canvas for basic widget
 */

function Slider({
  claims,
  currentIndex,
  setCurrentIndex,
  currentClaim,
  //updateFormState
}) {
  const sliderElement = useRef(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  //  const [activeIndex, setActiveIndex] = useState(0);

  const [disable, setDisable] = useState({ left: false, right: false });

  const CLAIM_RATING = {
    false: `#e53e3e`,
    true: `#38a169`,
    misleading: `#718096`,
    unverified: `#d69e2e`,
    'partly-true': `#8eb307`,
  };

  const handleNextClick = async () => {
    // setActiveIndex((prev) => {
    setCurrentIndex((prev) => {
      //  console.log({ next: prev });
      if (prev < sliderElement.current.childElementCount - 1) {
        //updateFormState(claims[parseInt(prev) + 1]);
        // sliderElement.current.scrollLeft += scrollWidth;
        return parseInt(prev) + 1;
      }
      // updateFormState(claims[prev]);
      return parseInt(prev);
    });
  };

  const handlePrevClick = () => {
    setCurrentIndex((prev) => {
      //setActiveIndex((prev) => {
      // console.log({ prev });
      if (prev > 0) {
        //    updateFormState(claims[prev - 1]);
        //  sliderElement.current.scrollLeft -= scrollWidth;
        return prev - 1;
      }
      //   updateFormState(claims[prev]);
      return prev;
    });
  };

  useEffect(() => {
    if (!sliderElement.current) return;

    if (sliderElement.current.childElementCount <= 1) {
      setDisable({ left: true, right: true });
      sliderElement.current.style = { 'overflow-x': 'unset' };
      return;
    }

    const maxScroll =
      sliderElement.current.children[1].getBoundingClientRect().x -
      sliderElement.current.firstElementChild.getBoundingClientRect().x;
    // const maxScroll = sliderElement.current.scrollWidth - sliderElement.current.clientWidth;
    // console.log({
    //   scroll: sliderElement.current.scrollWidth,
    //   client: sliderElement.current.clientWidth,
    // });
    setScrollWidth(maxScroll);
    // console.log({
    //   maxScroll,
    //   first: sliderElement.current.children[1].getBoundingClientRect().x,
    //   zero: sliderElement.current.firstElementChild.getBoundingClientRect().x,
    // });
  }, []);

  // useEffect(() => {
  //   console.log({ activeIndex });
  //   setCurrentIndex(parseInt(activeIndex));
  // }, [activeIndex]);

  useEffect(() => {
    sliderElement.current.scrollLeft = scrollWidth * currentIndex;
  }, [currentIndex]);

  // useEffect(() => {
  //   console.log({ currentIndex });
  //   setActiveIndex(parseInt(currentIndex));
  // }, [currentIndex]);

  // function debounce(func, timeout = 400) {
  //   let timer;
  //   return (...args) => {
  //     clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       func.apply(this, args);
  //     }, timeout);
  //   };
  // }
  // const debounce = (func, delay = 400) => {
  //   let debounceTimer;
  //   return function () {
  //     const context = this;
  //     const args = arguments;
  //     clearTimeout(debounceTimer);
  //     debounceTimer = setTimeout(() => func.apply(context, args), delay);
  //   };
  // };

  const delayedSetting = React.useCallback(
    _.debounce(
      (id) =>
        setCurrentIndex(() => {
          //  console.log({ id });
          return id;
        }),
      400,
    ),
    [],
  );
  const createObserver = () => {
    const options = {
      rootMargin: '0px',
      threshold: 0.49,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = entry.target.getAttribute('data-idx');
          // console.log({ idx, Ratio: entry.intersectionRatio });
          if (entry.intersectionRatio > 0.49) {
            //  console.log({ idx });
            delayedSetting(idx);
            // setActiveIndex(parseInt(idx));
            // const debounce = React.useCallback(
            //   _.debounce(
            //     () =>
            //       setCurrentIndex(() => {
            //         console.log({ currentIndex: idx });
            //         return parseInt(idx);
            //       }),
            //     2000,
            //   ),
            // ).current;
            // debounce();
            //updateFormState(claims[parseInt(idx)]);
          }
        } else {
          // clearTimeout(timeouts[entry.target.id]);
        }
      });
    }, options);

    document.querySelectorAll('.claims').forEach((claim) => {
      observer.observe(claim);
    });
  };
  useEffect(() => {
    createObserver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* 
  useEffect(()=>{
    if(!sliderElement.current) return;
    if(sliderElement.current.firstElementChild.getBoundingClientRect().x-num>=0) {
      setDisable({left:true})
    }
    if(sliderElement.current.lastElementChild.getBoundingClientRect().x-num<=0) {
      setDisable({right:true})
    }
  },[sliderElement.current ]) */

  return (
    <div
      sx={{
        width: '100%',
        mx: 'auto',
        fontSize: (theme) => `${theme.fontSizes.body}`,
        mb: (theme) => `${theme.space.spacing5}`,
      }}
    >
      {claims.length >= 1 && (
        <React.Fragment>
          <div
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-between',
              // pt: (theme) => `${theme.space.spacing6}`,
              pb: (theme) => `${theme.space.spacing3}`,
            }}
          >
            <button
              type="button"
              onClick={handlePrevClick}
              href-id="claim-1"
              disabled={disable.left}
              sx={{
                borderWidth: '1px',
                borderColor: (theme) => `${theme.colors.borderPrimary}`,
                borderRadius: 'default',
                textAlign: 'left',
                fontSize: (theme) => `${theme.fontSizes.h6}`,
                p: (theme) => `${theme.space.spacing3}`,
                '&:focus': { outline: 'none' },
                cursor: disable.left ? 'not-allowed' : 'pointer',
                opacity: disable.left ? 0.5 : null,
              }}
            >
              <FaChevronLeft
                sx={{
                  fill: 'currentColor',
                  width: (theme) => theme.sizes[4],
                  height: (theme) => theme.sizes[4],
                }}
              />
            </button>
            <h2
              className="heading"
              sx={{ width: 'full', py: (theme) => `${theme.space.spacing3}`, textAlign: 'center' }}
            >
              List of claims
            </h2>
            <button
              type="button"
              onClick={handleNextClick}
              href-id="claim-1"
              disabled={disable.right}
              sx={{
                borderWidth: '1px',
                borderColor: (theme) => `${theme.colors.borderPrimary}`,
                borderRadius: 'default',
                textAlign: 'left',
                fontSize: (theme) => `${theme.fontSizes.h6}`,
                p: (theme) => `${theme.space.spacing3}`,
                '&:focus': { outline: 'none' },
                cursor: disable.right ? 'not-allowed' : 'pointer',
                opacity: disable.right ? 0.5 : null,
              }}
            >
              <FaChevronRight
                sx={{
                  fill: 'currentColor',
                  width: (theme) => theme.sizes[4],
                  height: (theme) => theme.sizes[4],
                }}
              />
            </button>
          </div>
          <div
            ref={sliderElement}
            className="sliderF"
            sx={{ display: 'flex', overflowX: 'hidden', pb: (theme) => `${theme.space.spacing6}` }}
          >
            {claims.map((claim, i) => (
              <div
                id={`claim-${claim.id}`}
                className={`claims ${claim.id === currentClaim.id ? 'isActive' : ''}`}
                data-idx={i}
                key={i}
                sx={{
                  display: 'inline-block',
                  flex: 'none',
                  width: 'full',
                  scrollSnapAlign: 'start',
                  // mr: (theme) => `${theme.space.spacing6}`,
                }}
              >
                <div
                  sx={{
                    width: 'full',
                    display: 'flex',
                    flexDirection: 'column',
                    // borderWidth: '1px',
                    boxShadow: 'lg',
                  }}
                >
                  <div
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div
                      sx={{
                        display: 'flex',
                        p: (theme) => `0.25rem 1rem`, //${theme.space.spacing5}`,
                        alignItems: 'baseline',
                      }}
                    >
                      <h2
                        sx={{
                          fontWeight: 'bold',
                          mr: (theme) => `${theme.space.spacing3}`,
                          fontSize: '1.125rem',
                        }}
                      >
                        Claimant:{' '}
                      </h2>
                      {claim.claimant.name}
                    </div>
                    {/* <div
                      sx={{
                        display: 'flex',
                        flex: '1 1 0%',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <a
                        sx={{
                          display: 'block',
                          px: 2,
                          py: 1,
                          fontWeight: 'semibold',
                          borderRadius: 'default',
                          // '&:first-child': { px: 0 },
                          '&:hover': { bg: (theme) => `${theme.colors.gray[8]}` },
                        }}
                        href="/"
                      >
                        <svg
                          sx={{
                            fill: 'currentColor',
                            stroke: 'currentColor',
                            width: 5,
                            height: 5,
                            color: (theme) => `${theme.colors.gray[4]}`,
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 36 36"
                        >
                          <g transform="translate(-807 -2277)">
                            <ellipse
                              cx="18"
                              cy="18"
                              rx="18"
                              ry="18"
                              transform="translate(807 2277)"
                              stroke="#fff"
                            />
                            <path
                              d="M18,0A18,18,0,1,0,36,18,18,18,0,0,0,18,0ZM16,18a3.158,3.158,0,0,1-.188,1.068l5.024,2.417a3.225,3.225,0,1,1-.789,1.64L14.7,20.552a3.162,3.162,0,1,1,0-5.1l5.349-2.572a3.165,3.165,0,1,1,.788,1.64L15.81,16.932A3.153,3.153,0,0,1,16,18Z"
                              transform="translate(806.999 2277)"
                              fill="#fff"
                            />
                          </g>
                        </svg>
                      </a>
                    </div> */}
                  </div>
                  <div
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: (theme) => `${theme.space.spacing5}`,
                      color: (theme) => `${theme.colors.textLight}`,
                      bg: CLAIM_RATING[claim.rating.slug],
                    }}
                  >
                    <h2
                      sx={{
                        fontWeight: 'bold',
                        py: (theme) => `${theme.space.spacing3}`,
                        fontSize: '1.25rem',
                      }}
                    >
                      Claim:{' '}
                    </h2>
                    <div className="parsed" sx={{ display: 'flex' }}>
                      {claim.claim}
                      {/* {claim.rating.medium && (
                        <img
                          src={claim.rating.medium?.url.proxy}
                          alt={claim.rating.medium?.alt_text}
                          onError={addDefaultSrc}
                          sx={{
                            width: '1/6',
                            height: 'full',
                            m: (theme) => `${theme.space.spacing3}`,
                            borderTopLeftRadius: 'default',
                            borderTopRightRadius: 'default',
                          }}
                        />
                      )} */}
                    </div>
                  </div>
                  <div
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      p: (theme) => `${theme.space.spacing5}`,
                      borderBottomWidth: '1px',
                    }}
                  >
                    <h2 sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Fact: </h2>

                    <div className="parsed">
                      <p>{claim.fact}</p>
                      {/* {parseEditorJsData({ content: claim.review, scripts: true })} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

export default Slider;
