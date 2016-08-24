import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import { Link } from 'react-router';
import Rhombus from './Shared/Rhombus';
import classnames from 'classnames';
import AppStyles from '../../styles/application.scss';
import PubsArticlesLayoutStyles from '../../styles/layout/l-publications-articles.scss';
import PubArticleStyle from '../../styles/components/c-publication-article.scss';

class ArticlesPublications extends Component {

  componentDidMount() {
    this.props.getArticlesPublicationsEntries();
  }

  renderElement(articlePublication) {
    return (
      <article
        className={PubArticleStyle['c-publication-article']}
        key={articlePublication.link}
      >
        <h4 className={PubArticleStyle.title}>
          <a href={articlePublication.link} target="_blank">
            {articlePublication.title}
          </a>
        </h4>
        <div className={PubArticleStyle.description}>
          {articlePublication &&
            <p>{articlePublication.author}</p>}
          {articlePublication.date &&
            <p>{articlePublication.date}</p>}
        </div>
        <div className={PubArticleStyle['link-container']}>
          <Rhombus direction="-right">
            <Link
              to={articlePublication.link}
              target="_blank"
            >
              find out more
            </Link>
          </Rhombus>
        </div>
      </article>
    );
  }

  render() {
    const articlesPublications = this.props.articlesPublications;
    let pageContent = [];

    if (articlesPublications && articlesPublications.publications) {
      const publications = articlesPublications.publications.map(this.renderElement);

      if (!!publications && publications.length) {
        pageContent.push(
          <section key="publications">
            <h2
              className={classnames(AppStyles['section-title'],
              PubsArticlesLayoutStyles['section-title'])}
            >
              Publications
            </h2>
            <div className={PubsArticlesLayoutStyles.grid}>
              {publications}
            </div>
          </section>
        );
      }
    }

    if (articlesPublications && articlesPublications.articles) {
      const articles = articlesPublications.articles.map(this.renderElement);

      if (!!articles && articles.length) {
        pageContent.push(
          <section key="articles">
            <h2
              className={classnames(AppStyles['section-title'],
              PubsArticlesLayoutStyles['section-title'])}
            >
              Articles
            </h2>
            <div className={PubsArticlesLayoutStyles.grid}>
              {articles}
            </div>
          </section>
        );
      }
    }

    if (!pageContent.length) {
      pageContent = (<Loader />);
    }

    return (<div>
      <CoverPrimary
        title="Articles and Publications"
        subtitle="Read about Global Fishing Watch in the media."
        backgroundImageIndex={2}
      />
      <div className={PubsArticlesLayoutStyles['l-publications-news']}>
        <div className={AppStyles.wrap}>
          {pageContent}
        </div>
      </div>
      <Footer />
    </div>);
  }
}

ArticlesPublications.propTypes = {
  articlesPublications: React.PropTypes.object,
  getArticlesPublicationsEntries: React.PropTypes.func
};

export default ArticlesPublications;
