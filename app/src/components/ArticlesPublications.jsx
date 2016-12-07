import React, { Component } from 'react';
import classnames from 'classnames';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import Loader from './Shared/Loader';
import AppStyles from 'styles/_base.scss';
import StaticPageStyles from 'styles/layout/l-static-page.scss';
import PubArticleStyle from 'styles/components/c-publication-article.scss';
import articlesPublicationsBackgroundImage from 'assets/images/articles_publications.jpg';

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
        {articlePublication.image && <div
          className={PubArticleStyle.image}
          style={{ backgroundImage: `url(${articlePublication.image})` }}
        ></div>}
        <h4 className={PubArticleStyle.title}>
          <a href={articlePublication.link} target="_blank">
            {articlePublication.title}
          </a>
        </h4>
        <div className={PubArticleStyle.description}>
          {articlePublication && <p>{articlePublication.author}</p>}
          {articlePublication.date && <p>{articlePublication.date}</p>}
        </div>
      </article>
    );
  }

  render() {
    const articlesPublications = this.props.articlesPublications;
    let pageContent = [];

    if (articlesPublications && articlesPublications.articles) {
      const articles = articlesPublications.articles.map(this.renderElement);

      if (!!articles && articles.length) {
        pageContent.push(
          <section className="section-page" key="articles">
            <h2 className="section-title article-page">
              Articles
            </h2>
            <div className={StaticPageStyles.grid}>
              {articles}
            </div>
          </section>
        );
      }
    }

    if (articlesPublications && articlesPublications.publications) {
      const publications = articlesPublications.publications.map(this.renderElement);

      if (!!publications && publications.length) {
        pageContent.push(
          <section className="section-page" key="publications">
            <h2 className="section-title article-page">
              Publications
            </h2>
            <div className={StaticPageStyles.grid}>
              {publications}
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
        backgroundImage={articlesPublicationsBackgroundImage}
        attribution="© Bento Viana"
      />
      <div className={classnames(StaticPageStyles['l-static-page'], StaticPageStyles['-articles-pubs'])}>
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
