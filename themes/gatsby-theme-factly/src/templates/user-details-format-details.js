/** @jsx jsx */
import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/Layout';
import StoryCard from '../components/StoryCard';
import { jsx } from 'theme-ui';

function UserDetailsFormat({ data }) {
  const { dega } = data;

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row justify-between lg:border-b">
        <div className="main-content order-2 lg:order-1 lg:w-3/5 mx-auto">
          <div className="flex flex-col pb-6">
            <div>
              <h1 sx={{ textAlign: 'center', fontSize: 4, mb: 4, textTransform: 'capitalize' }}>
                {dega.user.first_name + ' ' + dega.user.last_name}
              </h1>
              <p sx={{ textAlign: 'center', pb: 4 }}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit iste nulla ipsum,
                earum pariatur quos debitis unde, accusantium quod quaerat modi atque corporis!
                Facilis officia illum deserunt amet placeat quia!
              </p>
              <div sx={{ textAlign: 'center', fontSize: 4, mb: 4 }}>
                Mail:<a href={`mailto:${dega.user.email}`}> {dega.user.email}</a>
              </div>
            </div>

            <div
              className="tabs"
              sx={{
                lineHeight: '18.4px',
                overflow: 'auto',
                overflowX: 'auto',
                overflowY: 'auto',
                textAlign: 'center',
                textRendering: 'optimizelegibility',
                whiteSpace: 'nowrap',
                borderBottom: '1px solid #919191',
                marginBottom: '1rem',
              }}
            >
              <ul
                sx={{
                  fontSize: ' inherit',
                  fontFamily: 'inherit',
                  margin: 0,
                  padding: 0,
                  border: 0,
                  lineHeight: 'inherit',
                  listStyle: 'none',
                  display: 'inline-flex',
                  li: {
                    fontSize: '16px',
                    fontWeight: 700,
                    hyphens: 'auto',
                    lineHeight: '16.8px',
                    marginBottom: '0px',
                    marginRight: '16px',
                    marginLeft: '16px',
                    marginTop: '0px',
                    paddingBottom: '14px',
                    paddingLeft: '0px',
                    paddingRight: '0px',
                    paddingTop: '16px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <li>
                  <Link to={`/users/${dega.user.id}`} activeClassName="active">
                    All
                  </Link>
                </li>
                {data.dega.formats.nodes.map((tab, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to={`/users/${dega.user.id}/formats/${tab.slug}`}
                        activeClassName="active"
                      >
                        {tab.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {dega.posts.nodes.length > 0 ? (
              <div
                sx={{
                  display: 'grid',
                  gridTemplateColumns: ['1fr', '1fr', 'repeat(2,1fr)'],
                  gridGap: '0.5rem',
                }}
              >
                {dega.posts.nodes.map((item, index) => (
                  <StoryCard
                    key={index}
                    cardStyle="iframely"
                    storyData={item}
                    excerpt
                    imageSize="w-full md:w-1/3 h-48 md:h-full py-4 md:py-4"
                  />
                ))}
              </div>
            ) : (
              <h2 sx={{ textAlign: 'center' }}>No posts found</h2>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UserDetailsFormat;

export const query = graphql`
  query($id: Int!, $format_id: Int!, $sid: [Int!]) {
    dega {
      user(id: $id) {
        id
        first_name
        last_name
        email
      }
      formats(spaces: $sid) {
        nodes {
          id
          slug
          name
        }
      }
      posts(users: [$id], formats: [$format_id], spaces: $sid) {
        nodes {
          users {
            id
            first_name
            last_name
          }
          categories {
            slug
            name
          }
          format {
            name
          }
          medium {
            alt_text
            url
          }
          created_at
          id
          status
          subtitle
          title
          slug
        }
      }
    }
  }
`;
