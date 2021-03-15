/** @jsx jsx */
import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import { graphql } from 'gatsby';
import { jsx } from 'theme-ui';
import parseEditorJsData from '../utils/parseEditorJsData';
import { isBrowser } from '../utils/isBrowser';
import FormatPageLayout from '../components/FormatPageLayout';

function CategoryDetailsAll({ data }) {
  const { dega } = data;
  // const formatType = 'fact-check';
  // const filterPosts = dega.posts.nodes.filter((i) => i.format.slug !== formatType);

  const [readMore, setReadMore] = React.useState(true);
  const [isReadMoreNeeded, setIsReadMoreNeeded] = useState(false);

  useEffect(() => {
    if (isBrowser) {
      const el = document.getElementById('category-description');
      setIsReadMoreNeeded(el?.clientHeight < el?.scrollHeight);
    }
  }, []);

  const header = (item) => {
    return (
      <div sx={{ mb: 6 }}>
        <h1 sx={{ textAlign: 'center', fontSize: [5, 6], mb: 4, textTransform: 'capitalize' }}>
          {item.name} 
        </h1>
        <div
          id="category-description"
          sx={{
            maxHeight: (theme) =>
              readMore ? `calc( 1rem + ${theme.lineHeights.normal}em * 8 )` : '100%',
            overflow: 'hidden',
            px: 4,
          }}
        >
          {parseEditorJsData(item.description)}
        </div>
        {item.description && isReadMoreNeeded && (
          <button
            type="button"
            onClick={() => setReadMore((prev) => !prev)}
            sx={{ px: 4, color: (theme) => `${theme.colors.blue[5]}` }}
          >
            {readMore ? 'Read more' : 'Read less'}
          </button>
        )}
      </div>
    );
  };
  return (
    <FormatPageLayout
      type="categories"
      posts={dega.posts.nodes}
      formats={dega.formats.nodes}
      item={dega.category}
      header={header}
    />
  );
}

export default CategoryDetailsAll;

export const query = graphql`
  query($id: Int!, $sid: [Int!]) {
    dega {
      category(id: $id) {
        description
        id
        medium {
          alt_text
          url
        }
        name
        slug
      }
      formats(spaces: $sid) {
        nodes {
          id
          slug
          name
        }
      }
      posts(categories: [$id], spaces: $sid) {
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
          medium {
            alt_text
            url
          }
          format {
            name
            slug
          }
          created_at
          id
          excerpt
          status
          subtitle
          title
          slug
        }
      }
    }
  }
`;
