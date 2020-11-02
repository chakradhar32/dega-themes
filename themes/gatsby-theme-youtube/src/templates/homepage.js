/** @jsx jsx */
/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import InfiniteScroll from 'react-infinite-scroller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import { jsx } from 'theme-ui';
import Layout from '../components/Layout';
import placeholderImg from '../static/images/placeholder.jpg';
// import PropTypes from 'prop-types';

const tabs = ['Home', 'Videos', 'Playlists'];

const IndexPage = ({ data, pageContext }) => {
  const { baseUrl, bannerData, bannerTitle, logo } = pageContext;
  const [activeTab, setActiveTab] = useState({
    Home: true,
  });

  const {
    allPlaylist: { nodes: playlists },
    allVideo: { nodes: videos },
    channel,
    allChannelSections,
  } = data;
  const [postItems, setPostItems] = useState(videos.slice(0, 20));
  const [hasNextPage, setHasNextPage] = useState(true);
  const handleLoadMore = () => {
    if (!hasNextPage) return false;
    const nextPageItems = videos.slice(postItems.length, postItems.length + 20);
    setPostItems([...postItems, ...nextPageItems]);
    setHasNextPage(postItems.length < videos.length);
  };

  const schemaVideoList = useMemo(() => {
    const itemListElement = [];
    postItems.forEach((videoItem) => {
      itemListElement.push({
        '@type': 'VideoObject',
        name: videoItem.snippet.title,
        description: videoItem.snippet.description,
        position: videoItem.snippet.position,
        url: `${baseUrl}/playlist/${videoItem.snippet.playlistId}?v=${videoItem.contentDetails.videoId}`,
        thumbnailUrl: [videoItem.local ? videoItem.local.childImageSharp.fluid.src : ''],
        uploadDate: videoItem.snippet.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${videoItem.contentDetails.videoId}`,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'http://schema.org/WatchAction' },
        },
      });
    });
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement,
    };
  }, [postItems, baseUrl]);

  return (
    <Layout baseUrl={baseUrl} logo={logo}>
      <Helmet>
        <title>{channel.snippet.title}</title>
        <meta name="description" content={channel.snippet.description} />
        <meta name="image" content={channel.snippet.thumbnails.high.url} />
        <script type="application/ld+json">{JSON.stringify(schemaVideoList)}</script>
      </Helmet>
      <div
        className="flex flex-col lg:flex-row justify-between lg:border-b"
        sx={{
          display: 'flex',
          flexDirection: ['column', 'column', 'row'],
          justifyContent: 'space-between',
          borderBottomWidth: [null, null, 'px'],
        }}
      >
        <div className="main-content w-full -mt-8" sx={{ width: 'full', marginTop: '-2rem' }}>
          <div>
            <div
              className="flex items-start border-b p-6 bg-gray-300"
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                borderBottomWidth: 'px',
                p: 6,
                bg: (theme) => `${theme.colors.gray[3]}`,
              }}
            >
              {/* <Img alt={channel.snippet.title} fluid={channel.local.childImageSharp.fluid} className="h-24" /> */}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href={`https://www.youtube.com/channel/${channel.channelId}`}
              >
                <img
                  alt={channel.snippet.title}
                  src={channel.snippet.thumbnails.high.url}
                  className="h-24"
                  sx={{ height: 24 }}
                />
              </a>
              <div
                className="flex flex-col justify-start px-4"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  px: 4,
                }}
              >
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`https://www.youtube.com/channel/${channel.channelId}`}
                  className="heading font-bold"
                  sx={{ fontWeight: 'bold' }}
                >
                  {channel.snippet.title}
                </a>
                <span
                  className="text-gray-600 text-xs md:text-sm pb-2"
                  sx={{ color: (theme) => `${theme.colors.gray[6]}`, fontSize: [0, 1], pb: 2 }}
                >
                  {Number(channel.statistics.subscriberCount).toLocaleString()} Subscribers
                </span>
                <a
                  rel="noopener noreferrer"
                  href={`https://www.youtube.com/channel/${channel.channelId}?sub_confirmation=1`}
                  target="_blank"
                  type="button"
                  className="block lg:px-4 uppercase text-center font-medium text-sm focus:outline-none bg-gray-100 rounded p-2"
                  sx={{
                    display: 'block',
                    p: 2,
                    px: [null, null, 4],
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontWeight: 'medium',
                    fontSize: 1,
                    ':focus': { outline: 'none' },
                    bg: (theme) => `${theme.colors.gray[1]}`,
                    borderRadius: 'default',
                  }}
                >
                  Subscribe
                </a>
                {/* <p className="text-base hidden md:inline">{channel.snippet.description}</p> */}
              </div>
              {bannerData.length > 0 && (
                <div
                  className="hidden none lg:flex flex-grow flex-col justify-center px-4"
                  sx={{
                    display: ['none', 'none', 'none', 'flex'],
                    flexGrow: '1',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: 4,
                  }}
                >
                  <h3
                    className="text-center font-bold py-2"
                    sx={{ textAlign: 'center', fontWeight: 'bold', py: 2 }}
                  >
                    {bannerTitle}
                  </h3>
                  <div
                    className="flex justify-center px-4"
                    sx={{ display: 'flex', justifyContent: 'center', px: 4 }}
                  >
                    {bannerData.map((item, i) => (
                      <Link
                        to={`${baseUrl}/playlist/${item.playlistId}`}
                        className="px-6"
                        sx={{ px: 6 }}
                        key={i}
                      >
                        <img
                          src={`/${item.icon}`}
                          alt={item.name}
                          className="h-20"
                          sx={{ height: 20 }}
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ul
              className="flex px-8 bg-gray-300"
              sx={{ display: 'flex', px: 8, bg: (theme) => `${theme.colors.gray[3]}` }}
            >
              {tabs.map((tab, i) => (
                <li className="-mb-px mr-1" key={i} sx={{ mr: 1, mb: '-0.25rem' }}>
                  <button
                    type="button"
                    className={`inline-block py-2 px-4 border border-b-0 rounded-t font-medium text-lg focus:outline-none
                    ${activeTab[tab] && 'bg-white'}`}
                    sx={{
                      borderWidth: 'px',
                      borderBottomWidth: '0',
                      display: 'inline-block',
                      py: 2,
                      px: 4,
                      borderTopRightRadius: 'default',
                      borderTopLeftRadius: 'default',
                      fontWeight: 'medium',
                      fontSize: 3,
                      ':focus': { outline: 'none' },
                      '&.bg-white': { bg: 'white' },
                    }}
                    onClick={() => setActiveTab({ [tab]: tab })}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {activeTab.Home && (
            <div>
              {allChannelSections.nodes.map((channelSection, i) => {
                const playlistId =
                  channelSection.playlist.id === channel.contentDetails.relatedPlaylists.uploads
                    ? channel.contentDetails.relatedPlaylists.uploads
                    : channelSection.playlist.id;
                const playlistTitle =
                  channelSection.playlist.snippet.title === 'Uploads'
                    ? 'Recent Videos'
                    : channelSection.playlist.snippet.title;
                return (
                  <React.Fragment key={i}>
                    <Link
                      className="flex items-center"
                      sx={{ display: 'flex', alignItems: 'center' }}
                      to={`${baseUrl}/playlist/${channelSection.playlist.id}`}
                    >
                      <h2 className="heading px-6 my-6" sx={{ px: 6, my: 6 }}>
                        {_.startCase(playlistTitle)}
                      </h2>
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="hidden md:block fill-current w-4 h-4"
                        sx={{
                          display: ['none', 'none', 'block'],
                          fill: 'currentColor',
                          width: 4,
                          height: 4,
                        }}
                      />

                      <span
                        className="hidden md:inline text-base"
                        sx={{ display: ['none', 'inline'], fontSize: 2 }}
                      >
                        Play All
                      </span>
                    </Link>
                    <div
                      className="border-b flex flex-row flex-wrap px-6 justify-center sm:justify-start items-center sm:items-start"
                      sx={{
                        borderBottomWidth: 'px',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        px: 6,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                      }}
                    >
                      {channelSection.videos.map((video, index) => (
                        <Link
                          key={index}
                          className="flex flex-col w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 no-underline hover:no-underline sm:pr-6 pb-4 mb-6"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: ['full', '1/3', '1/4', '1/5'],
                            textDecoration: 'none',
                            ':hover': {
                              textDecoration: 'none',
                            },
                            pr: 6,
                            pb: 4,
                            mb: 6,
                          }}
                          to={`${baseUrl}/playlist/${playlistId}?v=${video.contentDetails.videoId}`}
                        >
                          <div className="relative" sx={{ position: 'relative' }}>
                            {video.local && (
                              <Img
                                alt={video.snippet.title}
                                fluid={video.local.childImageSharp.fluid}
                                className="h-full w-full"
                                sx={{ height: 'full', width: 'full' }}
                              />
                            )}
                            {/* <div className="flex justify-center items-center p-6 bg-black opacity-75 absolute h-full top-0 right-0">
                      <span className="text-white">
                        {playlist.contentDetails.itemCount}
                      </span>
                    </div> */}
                            <div
                              className="opacity-0 hover:opacity-75 flex justify-center items-center p-6 bg-black absolute w-full h-full top-0 left-0"
                              sx={{
                                opacity: 0,
                                ':hover': { opacity: '0.75' },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 6,
                                bg: 'black',
                                position: 'absolute',
                                width: 'full',
                                height: 'full',
                                top: 0,
                                left: 0,
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPlay}
                                className="text-white fill-current w-4 h-4"
                                sx={{ width: 4, height: 4, fill: 'currentColor', color: 'white' }}
                              />

                              <span
                                className="text-white text-base"
                                sx={{ color: 'white', fontSize: 2 }}
                              >
                                Play
                              </span>
                            </div>
                          </div>
                          <div
                            className="w-full flex flex-col py-2"
                            sx={{ width: 'full', display: 'flex', flexDirection: 'column', py: 2 }}
                          >
                            <div
                              id="nav-0"
                              className="w-full font-bold  text-base text-gray-800"
                              sx={{
                                width: 'full',
                                fontWeight: 'bold',
                                fontSize: 2,
                                color: (theme) => `${theme.colors.gray[8]}`,
                              }}
                            >
                              {video.snippet.title}
                            </div>
                            <p
                              className="text-gray-600 text-xs pt-1"
                              sx={{ color: (theme) => `${theme.colors.gray[6]}`, fontSize: 0 }}
                            >
                              {video.snippet.channelTitle} - {video.snippet.publishedAt}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}
          {activeTab.Videos && (
            <div>
              <Link
                className="flex items-center px-6 mt-6"
                sx={{ display: 'flex', alignItems: 'center', px: 6, mt: 6 }}
                to={`${baseUrl}/playlist/${channel.contentDetails.relatedPlaylists.uploads}`}
              >
                <h2 className="heading pr-6" sx={{ pr: 6 }}>
                  Uploads
                </h2>
                <FontAwesomeIcon
                  icon={faPlay}
                  className="fill-current w-4 h-4"
                  sx={{ fill: 'currentColor', width: 4, height: 4 }}
                />
                <span className="text-base" sx={{ fontSize: 2 }}>
                  Play All
                </span>
              </Link>
              <div className="row-list-container">
                <InfiniteScroll
                  pageStart={0}
                  element="section"
                  loadMore={handleLoadMore}
                  hasMore={hasNextPage}
                  loader={
                    <div className="loader" key={-1}>
                      Loading ...
                    </div>
                  }
                >
                  {postItems.map((video, i) => (
                    <Link
                      key={i}
                      className="flex flex-col w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 no-underline hover:no-underline sm:pr-6 pb-4 mb-6"
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: ['full', '1/3', '1/4', '1/5'],
                        textDecoration: 'none',
                        ':hover': { textDecoration: 'none' },
                        pr: 6,
                        pb: 4,
                        mb: 6,
                      }}
                      to={`${baseUrl}/playlist/${channel.contentDetails.relatedPlaylists.uploads}?v=${video.contentDetails.videoId}`}
                    >
                      <div className="relative" sx={{ position: 'relative' }}>
                        {video.local && (
                          <Img
                            alt={video.snippet.title}
                            fluid={video.local.childImageSharp.fluid}
                            className="h-full w-full"
                            sx={{ width: 'full', height: 'full' }}
                          />
                        )}
                        {/* <div className="flex justify-center items-center p-6 bg-black opacity-75 absolute h-full top-0 right-0">
                    <span className="text-white">
                      {playlist.contentDetails.itemCount}
                    </span>
                  </div> */}
                        <div
                          className="opacity-0 hover:opacity-75 flex justify-center items-center p-6 bg-black absolute w-full h-full top-0 left-0"
                          sx={{
                            opacity: 0,
                            ':hover': { opacity: '0.75' },
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 6,
                            bg: 'black',
                            position: 'absolute',
                            width: 'full',
                            height: 'full',
                            top: 0,
                            left: 0,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faPlay}
                            sx={{ width: 4, height: 4, fill: 'currentColor', color: 'white' }}
                            className="text-white fill-current w-4 h-4"
                          />

                          <span
                            className="text-white text-base"
                            sx={{ color: 'white', fontSize: 2 }}
                          >
                            Play
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-full flex flex-col py-2"
                        sx={{ width: 'full', display: 'flex', flexDirection: 'column', py: 2 }}
                      >
                        <div
                          id="nav-0"
                          className="w-full font-bold  text-base text-gray-800"
                          sx={{
                            width: 'full',
                            fontWeight: 'bold',
                            fontSize: 2,
                            color: (theme) => `${theme.colors.gray[8]}`,
                          }}
                        >
                          {video.snippet.title}
                        </div>
                        <p
                          className="text-gray-600 text-xs pt-1"
                          sx={{ color: (theme) => `${theme.colors.gray[6]}`, fontSize: 0, pt: 1 }}
                        >
                          {video.snippet.channelTitle} - {video.snippet.publishedAt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </InfiniteScroll>
              </div>
            </div>
          )}
          {activeTab.Playlists && (
            <div
              className="flex flex-row flex-wrap p-6 justify-center sm:justify-start items-center sm:items-start"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                p: 6,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              {playlists.map((playlist, i) => (
                <Link
                  key={i}
                  className="flex flex-col w-full sm:w-1/3 lg:w-1/4 xl:w-1/5 no-underline hover:no-underline sm:pr-6 pb-4 mb-6"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: ['full', '1/3', '1/4', '1/5'],
                    textDecoration: 'none',
                    ':hover': {
                      textDecoration: 'none',
                    },
                    pr: 6,
                    pb: 4,
                    mb: 6,
                  }}
                  to={`${baseUrl}/playlist/${playlist.playlistId}?v=${playlist.videos[0].contentDetails.videoId}`}
                >
                  <div className="relative" sx={{ position: 'relative' }}>
                    {playlist.local ? (
                      <Img
                        alt={playlist.snippet.title}
                        fluid={playlist.local.childImageSharp.fluid}
                        className="h-full w-full"
                        sx={{ width: 'full', height: 'full' }}
                      />
                    ) : (
                      <img
                        src={placeholderImg}
                        alt="placeholder"
                        style={{ padding: '12% 0' }}
                        className="h-full w-full"
                        sx={{ width: 'full', height: 'full' }}
                      />
                    )}
                    {/* <div className="flex justify-center items-center p-6 bg-black opacity-75 absolute h-full top-0 right-0">
                    <span className="text-white">
                      {playlist.contentDetails.itemCount}
                    </span>
                  </div> */}
                    <div
                      className="opacity-0 hover:opacity-75 flex justify-center items-center p-6 bg-black absolute w-full h-full top-0 left-0"
                      sx={{
                        opacity: 0,
                        ':hover': { opacity: '0.75' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 6,
                        bg: 'black',
                        position: 'absolute',
                        width: 'full',
                        height: 'full',
                        top: 0,
                        left: 0,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPlay}
                        className="text-white fill-current w-4 h-4"
                        sx={{ color: 'white', fill: 'currentColor', width: 4, height: 4 }}
                      />
                      <span className="text-white text-base" sx={{ color: 'white', fontSize: 2 }}>
                        Play All
                      </span>
                    </div>
                  </div>
                  <div
                    className="w-full flex flex-col py-2"
                    sx={{ width: 'full', display: 'flex', flexDirection: 'column', py: 2 }}
                  >
                    <div>
                      <span
                        className="inline-block align-text-top bg-gray-200 rounded px-3 py-1 text-sm font-semibold text-gray-700"
                        sx={{
                          display: 'inline-block',
                          verticalAlign: 'text-top',
                          bg: (theme) => `${theme.colors.gray[2]}`,
                          borderRadius: 'default',
                          px: 3,
                          py: 1,
                          fontSize: 1,
                          fontWeight: 'semibold',
                          color: (theme) => `${theme.colors.gray[7]}`,
                        }}
                      >
                        {playlist.contentDetails.itemCount} Videos
                      </span>
                    </div>
                    <div
                      id="nav-0"
                      className="w-full font-bold  text-lg text-gray-800"
                      sx={{
                        width: 'full',
                        fontWeight: 'bold',
                        fontSize: 3,
                        color: (theme) => `${theme.colors.gray[8]}`,
                      }}
                    >
                      {playlist.snippet.title}
                    </div>
                    {/* <p className="text-gray-600 text-xs md:text-sm">
                    {playlist.snippet.publishedAt}
                  </p> */}
                    <span
                      className="text-gray-600 text-xs md:text-sm pt-2 uppercase"
                      sx={{
                        color: (theme) => `${theme.colors.gray[6]}`,
                        fontSize: [0, 1],
                        pt: 2,
                        textTransform: 'uppercase',
                      }}
                    >
                      View full playlist
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// IndexPage.propTypes = {
//   data: PropTypes.shape({}),
// };
export default IndexPage;

export const query = graphql`
  query PlaylistsPageQuery {
    channel {
      channelId
      statistics {
        subscriberCount
        videoCount
      }
      contentDetails {
        relatedPlaylists {
          uploads
        }
      }
      local {
        childImageSharp {
          fluid(maxWidth: 300, quality: 100) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
      snippet {
        thumbnails {
          high {
            url
          }
        }
        customUrl
        description
        title
      }
    }
    allChannelSections(sort: { fields: snippet___position }) {
      totalCount
      nodes {
        id
        snippet {
          type
        }
        playlist {
          id
          snippet {
            title
          }
        }
        videos {
          contentDetails {
            videoId
          }
          local {
            childImageSharp {
              fluid(maxWidth: 300, quality: 100) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
          snippet {
            playlistId
            channelTitle
            publishedAt(formatString: "MMM DD, YYYY")
            title
          }
        }
      }
    }
    allVideo(
      sort: { fields: snippet___publishedAt, order: DESC }
      filter: { snippet: { title: { nin: ["Private video", "Deleted video"] } } }
    ) {
      totalCount
      nodes {
        contentDetails {
          videoId
        }
        local {
          childImageSharp {
            fluid(maxWidth: 300, quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        snippet {
          playlistId
          channelTitle
          position
          description
          publishedAt(formatString: "MMM DD, YYYY")
          title
        }
      }
    }
    allPlaylist(filter: { list: { ne: false } }) {
      totalCount
      nodes {
        id
        playlistId
        videos {
          contentDetails {
            videoId
          }
        }
        contentDetails {
          itemCount
        }
        snippet {
          channelId
          publishedAt(formatString: "MMM DD, YYYY")
          title
        }
        local {
          childImageSharp {
            fluid(maxWidth: 300, quality: 100) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
