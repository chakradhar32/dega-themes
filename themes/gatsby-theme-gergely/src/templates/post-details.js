/** @jsx jsx */
import React from 'react';
import { graphql } from 'gatsby';

import { jsx } from 'theme-ui';
import Post from '@components/Post/index.js';
import StoryLinks from '@components/StoryLinks';
import Layout from '@components/Layout/index';
import { isBrowser } from '@utils/isBrowser';
import Seo from '@components/Seo';
import {
  FaTwitterSquare,
  FaFacebookSquare,
  FaWhatsappSquare,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { Link } from 'gatsby';
import parseDate from '@utils/parseDate';

/**
 * TODO: Add loader for infinite-scroller
 */
const PostDetails = ({ data }) => {
  const { allDegaPost, degaSpace, degaPost, recentPosts } = data;
  const { edges: posts } = allDegaPost;
  const post = posts.filter(({ node }) => node.id === degaPost.id)[0];
  const { previous: previousPost, next: nextPost } = post;
  console.log({ previousPost, nextPost });

  const [showSocialIcon, setShowSocialIcon] = React.useState(false);

  const [observer, setObserver] = React.useState({
    observe: () => {},
  });

  const handleShowSocialIcon = (entry) => {
    if (entry.intersectionRatio > 0) {
      setShowSocialIcon(false);
    } else {
      setShowSocialIcon(true);
    }
  };

  const createObserver = () => {
    const o = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.hasAttribute('social-icon')) {
          handleShowSocialIcon(entry);
        }
      });
    });
    setObserver(o);
  };
  React.useEffect(() => {
    createObserver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // for sharing links
  const title = encodeURIComponent(degaPost.title);
  let url;
  if (isBrowser) {
    url = encodeURIComponent(window.location.href);
  }

  return (
    <Layout>
      <Seo
        title={degaPost.title}
        description={degaPost.excerpt}
        image={`${degaPost.medium?.url?.proxy}`}
        canonical={`${degaSpace.site_address}/${degaPost.slug}`}
        type="article"
      />
      <div
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 1024,
            mx: 'auto',
            p: [
              (theme) => `${theme.space.spacing3}`,
              null,
              null,
              (theme) => `${theme.space.spacing8}`,
            ],
            pl: (theme) => [null, null, `${theme.space.spacing8}`],
          }}
        >
          <Post key={`details${degaPost.id}`} post={degaPost} observer={observer} />
          <div>
            <div
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                mt: (theme) => `${theme.space.spacing6}`,
                pb: (theme) => `${theme.space.spacing6}`,
                borderBottomWidth: '1px',
              }}
            >
              <div sx={{ flex: '0 0 50%', maxWidth: '50%', p: '1.5rem', textAlign: 'left' }}>
                {previousPost && (
                  <>
                    <Link
                      to={`/${previousPost.slug}`}
                      sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                      <span>
                        <FaChevronLeft />
                      </span>
                      <div>
                        <span sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Previous Post
                        </span>
                        <h3>{previousPost.title}</h3>
                      </div>
                    </Link>
                  </>
                )}
              </div>
              <div sx={{ flex: '0 0 50%', maxWidth: '50%', p: '1.5rem', textAlign: 'right' }}>
                {nextPost && (
                  <>
                    <Link
                      to={`/${nextPost.slug}`}
                      sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                      <div>
                        <span sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          Next Post
                        </span>
                        <h3>{nextPost.title}</h3>
                      </div>
                      <span>
                        <FaChevronRight />
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div
              sx={{
                mt: (theme) => `${theme.space.spacing6}`,
                pb: (theme) => `${theme.space.spacing6}`,
                borderBottomWidth: '1px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <h5
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  alignSelf: 'center',
                  mb: '1.5rem',
                  '&:after': {
                    position: 'absolute',
                    content: '""',
                    width: '50%',
                    height: '1px',
                    borderBottom: '2px solid #3BB2F6',
                    bottom: '-2px',
                    left: '50%',
                    marginLeft: '-25%',
                  },
                }}
              >
                Recent Posts
              </h5>
              <div sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {recentPosts.nodes
                  .filter((post) => post.id !== degaPost.id)
                  .splice(0, 6)
                  .map((post) => (
                    <div
                      key={post.id}
                      sx={{
                        flex: '0 0 50%',
                        maxWidth: '50%',
                        p: '1.5rem',
                        textAlign: 'left',
                      }}
                    >
                      <Link to={`/${post.slug}`} sx={{ display: 'flex' }}>
                        <div sx={{ flex: '0 0 33%' }}>
                          <img src={post.medium.url.proxy} alt="" />
                        </div>
                        <div sx={{ flex: '0 0 67%', pl: '1rem' }}>
                          {' '}
                          <h5>{post.title}</h5>{' '}
                          <p sx={{ fontSize: '0.75rem' }}>{parseDate(post.published_date)}</p>{' '}
                        </div>
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {showSocialIcon && (
            <>
              <div
                className="top-auto"
                style={{
                  top: '40vh',
                }}
                sx={{
                  display: ['none', null, 'flex'],
                  flexDirection: 'column',
                  position: 'fixed',
                  ml: (theme) => `-${theme.space.spacing8}`,
                  // left: 0,
                  alignItems: 'center',
                  justifyContent: ['flex-start', null, 'flex-end'],
                  top: '40vh',
                }}
              >
                <a
                  title="Share on Facebook"
                  href={`https://www.facebook.com/sharer.php?u=${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    m: (theme) => `${theme.space.spacing1}`,
                    p: (theme) => `${theme.space.spacing3}`,
                    '&:first-of-type': { mx: 0 },
                    fontWeight: 'semibold',
                    borderRadius: 'default',
                  }}
                >
                  <FaFacebookSquare
                    sx={{ fontSize: (theme) => `${theme.fontSizes.h4}` }}
                    color="#3b5998"
                  />
                </a>
                <a
                  title="Tweet it"
                  href={`https://twitter.com/share?text=${title}-&url=${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    m: (theme) => `${theme.space.spacing1}`,
                    '&:first-of-type': { mx: 0 },
                    p: (theme) => `${theme.space.spacing3}`,
                    fontWeight: 'semibold',
                    borderRadius: 'default',
                  }}
                >
                  <FaTwitterSquare
                    sx={{ fontSize: (theme) => `${theme.fontSizes.h4}` }}
                    color="#1da1f2"
                  />
                </a>
                <a
                  title="Share on WhatsApp"
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${title} - ${url}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'block',
                    m: (theme) => `${theme.space.spacing1}`,
                    '&:first-of-type': { mx: 0 },
                    p: (theme) => `${theme.space.spacing3}`,
                    fontWeight: 'semibold',
                    borderRadius: 'default',
                  }}
                >
                  <FaWhatsappSquare
                    sx={{ fontSize: (theme) => `${theme.fontSizes.h4}` }}
                    color="#25d366"
                  />
                </a>
              </div>
              {/* Mobile share icon at the bottom */}
              {/* <div
                sx={{
                  display: [null, null, null, 'none'],
                  position: 'fixed',
                  m: 2,
                  bottom: 0,
                  right: 0,
                }}
              >
                <svg
                  sx={{
                    fill: 'currentColor',
                    stroke: 'currentColor',
                    color: (theme) => `${theme.colors.gray[4]}`,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
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
              </div> */}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PostDetails;
export const query = graphql`
  query ($id: String!) {
    degaSpace {
      site_address
    }
    allDegaPost {
      edges {
        node {
          published_date
          description
          excerpt
          id
          schemas
          slug
          status
          subtitle
          title
          updated_at
          users {
            email
            first_name
            last_name
            id
            slug
          }
          tags {
            id
            name
            slug
            description
          }
          medium {
            alt_text
            id
            url
            dimensions
          }
          format {
            name
            slug
            id
            description
          }
          claims {
            checked_date
            claim_date
            claim_sources
            claimant {
              description
              id
              name
              slug
              tag_line
            }
            description
            id
            fact
            review_sources
            slug
            claim
            rating {
              description
              id
              name
              numeric_value
              slug
              medium {
                alt_text
                id
                url
                dimensions
              }
            }
          }
          categories {
            description
            created_at
            id
            name
            slug
            medium {
              alt_text
              id
              url
              dimensions
            }
          }
        }
        next {
          slug
          title
          published_date
          medium {
            alt_text
            id
            url
            dimensions
          }
        }
        previous {
          slug
          title
          published_date
          medium {
            alt_text
            id
            url
            dimensions
          }
        }
      }
    }
    degaPost(degaId: { eq: $id }) {
      published_date
      description
      excerpt
      id
      schemas
      slug
      status
      subtitle
      title
      updated_at
      users {
        email
        first_name
        last_name
        display_name
        id
      }
      tags {
        id
        name
        slug
        description
      }
      medium {
        alt_text
        id
        url
        dimensions
      }
      format {
        name
        slug
        id
        description
      }
      claims {
        checked_date
        claim_date
        claim_sources
        claimant {
          description
          id
          name
          slug
          tag_line
        }
        description
        id
        fact
        review_sources
        slug
        claim
        rating {
          description
          id
          name
          numeric_value
          slug
          medium {
            alt_text
            id
            url
            dimensions
          }
        }
      }
      categories {
        description
        created_at
        id
        name
        slug
        medium {
          alt_text
          id
          url
          dimensions
        }
      }
    }
    recentPosts: allDegaPost(
      sort: { fields: created_at, order: DESC }
      filter: { format: { slug: { eq: "article" } } }
      limit: 6
    ) {
      nodes {
        created_at
        title
        excerpt
        slug
        users {
          display_name
          slug
          id
        }
        published_date
        categories {
          name
          slug
        }
        medium {
          dimensions
          alt_text
          url
        }
      }
    }
    recentFactChecks: allDegaPost(
      sort: { fields: created_at, order: DESC }
      filter: { format: { slug: { eq: "fact-check" } } }
      limit: 6
    ) {
      nodes {
        created_at
        title
        excerpt
        slug
        users {
          display_name
          slug
          id
        }
        published_date
        categories {
          name
          slug
        }
        medium {
          dimensions
          alt_text
          url
        }
      }
    }
  }
`;
