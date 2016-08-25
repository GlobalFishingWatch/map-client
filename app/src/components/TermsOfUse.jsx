import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import { Link } from 'react-router';
import StaticPageStyles from '../../styles/layout/l-static-page.scss';
import AppStyles from '../../styles/application.scss';
import TextPages from '../../styles/components/c-text-pages.scss';
import termsBackgroundImage from '../../assets/images/terms.png';

class TermsOfUse extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Terms Of Use"
        subtitle=""
        backgroundImage={termsBackgroundImage}
        attribution="© OCEANA / Melissa Forsyth"
      />
      <div className={StaticPageStyles['l-static-page']}>
        <div className={AppStyles.wrap}>
          <section className={TextPages['c-text-pages']}>
            <article>
              <p>Last Modified: August 3, 2016</p>
              <p>
                This Global Fishing Watch (“GFW”) Terms of Service (“Agreement” or “Terms”), is between SkyTruth,
                a Virginia nonprofit organization qualifying for Federal tax exemption under Section 501(c)(3) of the
                Internal Revenue Code of 1986, as amended, and you and your company organization (“You” or“Your”).
                By clicking “I agree”, you are bound by the terms of this Agreement. If you choose not to click
                on “I agree” you will be redirected from this website (“Site”).
                Your use of any portion of the Site, any information or data
                provided on the Site, or any services made available through the Site (the “Services”)
                is subject to the terms and conditions set forth herein.
              </p>
              <ol className={TextPages['first-level-list']}>
                <li>
                  <h2>Changes to the Terms of Use</h2>
                  <p>
                    SkyTruth reserves the right, at its sole discretion, to modify, add or delete portions of,
                    or otherwise change,
                    these Terms at any time without notice to You by posting the changed Terms on the Site. All
                    changes shall be effective
                    immediately upon posting. Please check these Terms periodically
                    for changes. Your continued use of the Services after the posting of
                    changes constitutes Your binding acceptance of such changes.
                  </p>
                </li>
                <li>
                  <h2>Using Global Fishing Watch</h2>
                  <ol className={TextPages['second-level-list']}>
                    <li>
                      <p>
                        Prohibited Uses. As a condition of Your use of the Site and the Services,
                        You warrant to SkyTruth that You will only use the Services for a lawful purpose and
                        one that is not prohibited by these terms, conditions
                        or notices. You may not use the Services in any manner which could
                        damage, disable, overburden or impair the
                        Services or interfere with any other party’s use and enjoyment of
                        he Services. Recognizing the global nature
                        of the Internet, You agree to comply with all local rules regarding
                        online conduct and acceptable content in
                        the jurisdiction in which You are visiting the Site.
                      </p>
                    </li>
                    <li>
                      <p>
                      Sole Responsibility. You are solely responsible for any and all acts and
                      omissions that occur under Your account, and You agree not to engage in
                      unacceptable use of the Site or the Services, which includes, without
                      limitation, use of the Site or the Services to:</p>
                      <ol className={TextPages['third-level-ordered-list']}>
                        <li>
                          <p>interfere, disrupt, or attempt to gain unauthorized access to
                          other accounts or any other computer network;</p>
                        </li>
                        <li>
                          <p>disseminate, store or transmit viruses, trojan horses, or any
                          other malicious code or program; or</p>
                        </li>
                        <li>
                          <p>engage in any other activity deemed by SkyTruth to be in conflict
                            with these Terms (including any Third Party Provider terms referenced
                            in Section 2 below).
                          </p>
                        </li>
                      </ol>
                    </li>
                    <li>
                      <p>Indemnity. You agree to indemnify, hold harmless and, at SkyTruth’s request, defend
                      SkyTruth and its subsidiaries, affiliates, officers, agents, partners and
                      employees from any claim or demand, including reasonable attorneys’
                      fees, made by any third party due to or arising out of content You
                      submit to, post to, or transmit through the Site or the Services,
                      Your use of the Site or the Services, or Your violation of these Terms.
                      </p>
                    </li>
                    <li>
                      <p>
                      Acknowledgments. The Site allows You to access and view a variety of
                      content, including but not limited to map and vessel data, and other
                      related information provided by SkyTruth and its partners, licensors
                      and/or users of the Site or the Services. You understand and agree to
                      the following with respect to all content made available by or through the Site:
                      </p>
                      <ol className={TextPages['third-level-ordered-list']}>
                        <li>
                          <p>that map data and related content are provided for informational
                          purposes only, and SkyTruth makes no warranties regarding the same;</p>
                        </li>
                        <li>
                          <p>that the information on the Site is not updated in real-time,
                          and therefore the map results may not be accurate;</p>
                        </li>
                        <li>
                          <p>SkyTruth assumes no responsibility for Your use of or actions in reliance on
                          the information contained on the Site; and therefore, You should exercise
                          judgment in Your use of all content made available by or through the Site,
                          including but not limited to, seeking independent verification of the factual
                          information provided on the Site.</p>
                        </li>
                      </ol>
                    </li>
                    <li>
                      <p>Reservation of Rights. SkyTruth reserves all rights not expressly granted to
                      You. The use of the Site, including its software, services, maps and other
                      content, is only licensed to You and such license is non-transferable.
                      In no event may You copy, loan, rent, time-share, sublicense, assign,
                      transfer, lease, sell or otherwise dispose of the SkyTruth Site’s software,
                      maps, or other content on a temporary or permanent basis except as expressly
                      provided herein. These Terms shall benefit SkyTruth and its successors and assigns.
                      You may not, or permit any third party to, modify, adapt, translate, create derivative works
                      from, reverse engineer, decompile, disassemble, or otherwise attempt to derive any source code
                      from the Site’s software. All logos and product names appearing on or in connection with the Site
                      are proprietary to SkyTruth or its licensors and/or suppliers.
                      You agree never to remove any proprietary
                      notices or product identification labels from the Site’s software, maps,
                      and other content, if applicable.</p>
                    </li>
                  </ol>
                </li>
                <li>
                  <h2>Third Party Terms</h2>
                  <p>
                    GFW incorporates data and information from, and is delivered using technologies
                    supplied by, third party suppliers to SkyTruth (“Third Party Providers”).
                    In addition to the terms contained herein, You are responsible for reviewing
                    and complying with the applicable use provisions found in the terms of such Third
                    Party Providers. Below are links to the Third Party Provider terms. Your continued
                    use of this Site indicates your acceptance of the Third Party Provider terms set forth therein.
                  </p>
                  <ul className={TextPages['third-level-list']}>
                    <li>
                      <a
                        className={AppStyles['-underline']}
                        href="http://earthengine.google.org/terms" target="_blank"
                      >
                        Google Earth Engine
                      </a>
                    </li>
                    <li>
                      <a
                        className={AppStyles['-underline']}
                        href="http://www.google.com/intl/en_US/help/terms_maps.html"
                        target="_blank"
                      >
                        Google Maps/Earth
                      </a>
                    </li>
                    <li>
                      <a
                        className={AppStyles['-underline']}
                        href="https://cloud.google.com/terms/service-terms"
                        target="_blank"
                      >
                        Google Cloud Platform
                      </a>
                    </li>
                    <li>
                      <a
                        className={AppStyles['-underline']}
                        href="https://carto.com/terms"
                        target="_blank"
                      >
                        CARTO
                      </a>
                    </li>
                    <li>
                      <Link className={AppStyles['-underline']} to="/orbcomm">Orbcomm</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <h2>Trademarks</h2>
                  <p>
                    SkyTruth, Oceana, Google, the term “Global Fishing Watch,” and all related names,
                    logos, product and service names, designs and slogans are trademarks of SkyTruth
                    or its partners. You must not use such marks without the prior written permission
                    of SkyTruth or its partners, as applicable.
                  </p>
                </li>
                <li>
                  <h2>Ownership</h2>
                  <p>
                    All other materials displayed or performed on the Site, including,
                    but not limited to text, graphics, maps, logos, tools, photographs,
                    images, illustrations, software or source code, audio and video,
                    and animations are the property of SkyTruth and its partners and
                    are protected by United States and international copyright laws.
                  </p>
                </li>
                <li>
                  <h2>Your Content</h2>
                  <p>
                    This Site currently does not allow You to submit content. This policy will be revised to
                    reflect terms for the submission of content prior to enabling that feature.
                  </p>
                </li>
                <li>
                  <h2>Disclaimers of Warranties</h2>
                  <p>
                    You understand that we cannot and do not guarantee or warrant that files available for
                    downloading from the internet or the Site will be free of viruses or other destructive
                    code. You are responsible for implementing sufficient procedures and checkpoints
                    to satisfy Your particular requirements for anti-virus protection and accuracy
                    of data input and output, and for maintaining a means external to our site for
                    any reconstruction of any lost data. WE WILL NOT BE LIABLE FOR ANY LOSS OR DAMAGE
                    CAUSED BY A DISTRIBUTED DENIAL-OF-SERVICE ATTACK, VIRUSES OR OTHER TECHNOLOGICALLY
                    HARMFUL MATERIAL THAT MAY INFECT YOUR COMPUTER EQUIPMENT, COMPUTER PROGRAMS,
                    DATA OR OTHER PROPRIETARY MATERIAL DUE TO YOUR USE OF THE SITE OR ANY SERVICES
                    OR ITEMS OBTAINED THROUGH THE SITE OR TO YOUR DOWNLOADING OF ANY MATERIAL POSTED
                    ON IT, OR ON ANY WEBSITE LINKED TO IT.
                    YOUR USE OF THE SITE, AND ITS SOFTWARE, SERVICES, MAPS AND OTHER CONTENT,
                    INCLUDING ANY THIRD-PARTY SOFTWARE, SERVICES, MEDIA, OR OTHER CONTENT MADE AVAILABLE
                    IN CONJUNCTION WITH OR THROUGH THE SITE, IS AT YOUR OWN RISK. THE SITE, AND ITS SOFTWARE,
                    SERVICES, MAPS AND OTHER CONTENT, INCLUDING ANY THIRD-PARTY SOFTWARE, SERVICES,
                    MEDIA, OR OTHER CONTENT MADE AVAILABLE IN CONJUNCTION WITH OR THROUGH THE SITE ARE
                    PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT ANY WARRANTIES OF ANY KIND,
                    EITHER EXPRESS OR IMPLIED. NEITHER SKYTRUTH NOR ANY PERSON ASSOCIATED WITH SKYTRUTH
                    MAKES ANY WARRANTY OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY,
                    RELIABILITY, QUALITY, ACCURACY OR AVAILABILITY OF THE SITE. WITHOUT LIMITING THE
                    FOREGOING, NEITHER THE COMPANY NOR ANYONE ASSOCIATED WITH THE COMPANY REPRESENTS
                    OR WARRANTS THAT THE SITE, AND ITS SOFTWARE, SERVICES, MAPS AND OTHER CONTENT,
                    INCLUDING ANY THIRD-PARTY SOFTWARE, SERVICES, MEDIA, OR OTHER CONTENT MADE AVAILABLE
                    IN CONJUNCTION WITH OR THROUGH THE SITE WILL BE ACCURATE, RELIABLE, ERROR-FREE OR
                    UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT OUR SITE OR THE SERVER THAT MAKES
                    IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS OR THAT THE SITE OR
                    ANY SERVICES OR ITEMS OBTAINED THROUGH THE SITE WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                    SKYTRUTH HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
                    STATUTORY OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
                    MERCHANTABILITY, NON-INFRINGEMENT AND FITNESS FOR PARTICULAR PURPOSE.
                    THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE
                    EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                  </p>
                </li>
                <li>
                  <h2>Limitation of Liability and Damages</h2>
                  <ol className={TextPages['second-level-list']}>
                    <li>
                      <p>Limitation of Liability. UNDER NO CIRCUMSTANCES, AND UNDER NO LEGAL THEORY,
                      INCLUDING BUT NOT LIMITED TO NEGLIGENCE, SHALL SKYTRUTH OR ITS AFFILIATES,
                      CONTRACTORS, EMPLOYEES, AGENTS, OR THIRD PARTY PARTNERS OR SUPPLIERS,
                      BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL, CONSEQUENTIAL OR EXEMPLARY
                      DAMAGES (INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR USE OR COST OF COVER)
                      ARISING OUT OF OR RELATING TO THESE TERMS OR THAT RESULT FROM YOUR USE OR
                      THE INABILITY TO USE THE SITE, INCLUDING SOFTWARE, SERVICES, MAPS, CONTENT,
                      USER SUBMISSIONS, OR ANY THIRD PARTY SITES REFERRED TO ON OR BY THE SITE,
                      EVEN IF SKYTRUTH OR A SKYTRUTH-AUTHORIZED REPRESENTATIVE HAS BEEN ADVISED
                      OF THE POSSIBILITY OF SUCH DAMAGES.
                      </p>
                    </li>
                    <li>
                      <p>
                      Limitation of Damages. IN NO EVENT SHALL THE TOTAL LIABILITY OF
                      SKYTRUTH OR ITS AFFILIATES, CONTRACTORS, EMPLOYEES, AGENTS,
                      THIRD PARTY PARTNERS, LICENSORS OR SUPPLIERS TO YOU FOR ALL
                      DAMAGES, LOSSES, AND CAUSES OF ACTION ARISING OUT OF OR
                      RELATING TO THESE TERMS OR YOUR USE OF THE SITE (WHETHER
                      IN CONTRACT, TORT (INCLUDING NEGLIGENCE), WARRANTY OR
                      OTHERWISE) EXCEED ONE HUNDRED DOLLARS ($100 USD).
                      </p>
                    </li>
                    <li>
                      <p>
                      Savings Clause. CERTAIN JURISDICTIONS DO NOT ALLOW EXCLUSIONS OR LIMITATIONS
                      ON CERTAIN DAMAGES AND LIABILITIES. IF YOU RESIDE IN SUCH A JURISDICTION,
                      SOME OR ALL OF THE ABOVE EXCLUSIONS OR LIMITATIONS MAY NOT APPLY TO YOU,
                      AND YOU MAY HAVE ADDITIONAL RIGHTS. THE LIMITATIONS OR EXCLUSIONS LIABILITY
                      CONTAINED IN THESE TERMS APPLY TO YOU TO THE FULLEST EXTENT SUCH LIMITATIONS
                      OR EXCLUSIONS ARE PERMITTED UNDER THE LAWS OF THE JURISDICTION IN WHICH YOU ARE LOCATED.
                      </p>
                    </li>
                  </ol>
                </li>
                <li>
                  <h2>Digital Millennium Copyright Act Compliance</h2>
                  <p>
                    If You are a copyright owner or an agent thereof, and believe that any Site
                    content infringes upon Your copyrights, You may submit a notification
                    pursuant to the Digital Millennium Copyright Act (“DMCA”) by providing
                    our Copyright Agent (as defined below) with the following information
                    in writing (see 17 U.S.C § 512(c)(3) for further detail):
                  </p>
                  <ol className={TextPages['second-level-list']}>
                    <li>
                      <p>
                      A physical or electronic signature of a person authorized
                      to act on behalf of the owner of an exclusive right that is allegedly infringed;
                      </p>
                    </li>
                    <li>
                      <p>
                        Identification of the exact location on the Site of copyrighted work
                        claimed to have been infringed, or, if multiple copyrighted works on the
                        Site are covered by a single notification, a representative list of such
                        works as located on the Site;
                      </p>
                    </li>
                    <li>
                      <p>The address, telephone number and electronic mail address of the complaining party</p>
                    </li>
                    <li>
                      <p>
                        A statement that the complaining party has
                        a good faith belief that use of the material in the
                        manner complained of is not authorized by the copyright owner, its agent or the law
                      </p>
                    </li>
                    <li>
                      <p>
                        Your electronic or physical signature (as appropriate).
                      </p>
                    </li>
                  </ol>
                  <p>
                    The designated Copyright Agent to receive notifications of claimed infringement is:
                    SkyTruth Tel: <a className={AppStyles['-underline']} href="tel:1 (304) 885-4581">
                    +1 (304) 885-4581</a> Email: <a
                      className={AppStyles['-underline']}
                      href="mailto:dmcaagent@skytruth.org"
                    >
                      dmcaagent@skytruth.org
                    </a>.
                  </p>
                </li>
              </ol>
              <ol className={TextPages['first-level-list']}>
                <li>
                  <h2>Additional Terms</h2>
                  <ol className={TextPages['second-level-list']}>
                    <li>
                      <p>
                        These Terms shall be governed by and construed in accordance with
                        the laws of the State of Virginia, U.S.A., excluding its conflict
                        of laws provisions. You agree that any action at law or in equity
                        arising out of or relating to these Terms or SkyTruth shall be filed
                        only in the federal court in and for the State of Virginia, U.S.A.,
                        and You hereby consent and submit to the exclusive personal jurisdiction
                        and venue of such court for the purposes of litigating any such action.
                        The parties hereby exclude application of the U.N. Convention on Contracts
                        for the International Sale of Goods from this Agreement and any transaction
                        related thereto.
                      </p>
                    </li>
                    <li>
                      <p>A provision of these Terms may be waived only by a written
                      instrument executed by the party entitled to the benefit
                      of such provision. The failure of SkyTruth to exercise or
                      enforce any right or provision of these Terms will not
                      constitute a waiver of such right or provision.</p>
                    </li>
                    <li>
                      <p>If any provision of these Terms shall be unlawful, void, or for any reason unenforceable,
                      then that provision shall be deemed severable from these Terms and shall not affect
                      the validity and enforceability of any remaining provisions.
                      You agree that no joint venture, partnership, employment or agency
                      relationship exists between You and SkyTruth as a result of these
                      Terms or use of SkyTruth. You further acknowledge no confidential,
                      fiduciary, contractually implied or other relationship is created
                      between You and SkyTruth other than pursuant to these Terms.</p>
                    </li>
                    <li>
                      <p>You must fully comply with all applicable export laws,
                      including U.S. law, and must not directly or indirectly export
                      any computer hardware, software, technical data or derivatives
                      of such hardware, software or technical data (“HSoTD”), or re-export,
                      or permit the shipment or transfer of same: (i) into (or to a national
                      or resident of) Cuba, Iran, North Korea, Sudan, Syria or any other country,
                      destination or person to which HSoTD would be prohibited by the United
                      States, such as, but not limited to, anyone on the U.S. Treasury
                      Department’s List of Specially Designated Nationals, List of Specially
                      Designated Terrorists or List of Specially Designated Narcotics Traffickers,
                      or the U.S. Commerce Department’s Denied Parties List; or (ii) to any country
                      or destination for which the United States requires an export license or other
                      approval for export without first having obtained such license or other approval.</p>
                    </li>
                    <li>
                      <p>The Agreement constitutes the entire agreement
                      between the parties and supersedes any prior or contemporaneous
                      written or oral agreement or understanding with respect to its subject matter.</p>
                    </li>
                    <li>
                      <p>You understand and acknowledge that this Beta Version of Global
                      Fishing Watch is considered proprietary and confidential by SkyTruth
                      and you agree not to provide your login credentials, screenshots, screensharing
                      or any information about the Global Fishing Watch Beta Version to any third party.</p>
                    </li>
                  </ol>
                </li>
                <li>
                  <h2>Your Comments and Concerns</h2>
                  <p>
                    The Site is operated by SkyTruth, P.O. Box 3283, Shepherdstown, WV 25443. All feedback,
                    comments, requests for technical support, and other communications relating to the
                    Site should be directed
                    to <a className={AppStyles['-underline']} href="mailto:info@skytruth.org">info@skytruth.org</a>.
                  </p>
                </li>
              </ol>
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </div>);
  }

}

export default TermsOfUse;
