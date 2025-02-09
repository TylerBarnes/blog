import ArchivePost from '../components/archive-post';
import Byline from '../components/byline';
import Categories from '../components/categories';
import FollowUs from '../components/follow-us';
import Layout from '../components/layout';
import NewsletterForm, {useNewsletterForm} from '../components/newsletter-form';
import PropTypes from 'prop-types';
import React from 'react';
import RecentPosts, {PostLink} from '../components/recent-posts';
import styled from '@emotion/styled';
import {
  DateText,
  ExcerptText,
  FONT_FAMILY_MONO,
  HeadingLink,
  InnerWrapper,
  Main,
  PostImage,
  SectionHeading,
  Sidebar,
  TopFold
} from '../components/ui';
import {IconProceed} from '@apollo/space-kit/icons/IconProceed';
import {Link, graphql} from 'gatsby';
import {colors} from '@apollo/space-kit/colors';
import {decode} from 'he';
import {size} from 'polished';

const FeaturedPost = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  marginBottom: 124
});

const StyledRecentPosts = styled(RecentPosts)({
  marginBottom: 90
});

const ViewAllLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: FONT_FAMILY_MONO,
  color: colors.indigo.base,
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline'
  },
  svg: {
    ...size('1em'),
    marginLeft: 12
  }
});

export default function Index(props) {
  const newsletterFormProps = useNewsletterForm();
  const [featuredPost, ...otherPosts] = props.data.allWpPost.nodes;
  const recentPosts = otherPosts.slice(0, 4);
  const archivePosts = otherPosts.slice(4);
  return (
    <Layout>
      <TopFold>
        <DateText style={{marginBottom: 12}} date={featuredPost.date} />
        <h2>
          <HeadingLink to={featuredPost.uri}>
            {decode(featuredPost.title)}
          </HeadingLink>
        </h2>
      </TopFold>
      <InnerWrapper>
        <Main>
          <FeaturedPost>
            <PostLink to={featuredPost.uri}>
              {featuredPost.featuredImage && (
                <PostImage
                  src={
                    featuredPost.featuredImage.node.remoteFile.childImageSharp
                      .original.src
                  }
                />
              )}
              <ExcerptText excerpt={featuredPost.excerpt} />
            </PostLink>
            <Byline author={featuredPost.author.node} />
          </FeaturedPost>
          <SectionHeading>What&apos;s new</SectionHeading>
          <StyledRecentPosts posts={recentPosts} />
          <SectionHeading style={{marginBottom: 8}}>Archive</SectionHeading>
          <div style={{marginBottom: 48}}>
            <ViewAllLink to="/archive/1">
              View all posts <IconProceed />
            </ViewAllLink>
          </div>
          <div>
            {archivePosts.map((post) => (
              <ArchivePost key={post.id} post={post} />
            ))}
          </div>
        </Main>
        <Sidebar>
          <NewsletterForm {...newsletterFormProps} />
          <FollowUs />
          <Categories />
        </Sidebar>
      </InnerWrapper>
    </Layout>
  );
}

Index.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    allWpPost(sort: {fields: date, order: DESC}, limit: 10) {
      nodes {
        id
        date
        excerpt
        title
        uri
        featuredImage {
          node {
            remoteFile {
              childImageSharp {
                original {
                  src
                }
              }
            }
          }
        }
        categories {
          nodes {
            slug
            id
            name
          }
        }
        author {
          node {
            name
            slug
            avatar {
              url
            }
            userMetadata {
              title
              avatarId {
                remoteFile {
                  childImageSharp {
                    original {
                      src
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
