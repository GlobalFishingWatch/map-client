import React, { Component } from 'react';
import CoverPrimary from './Shared/CoverPrimary';
import Footer from './Shared/Footer';
import StaticPageStyles from 'styles/layout/l-static-page.scss';
import ToolTip from 'components/Shared/ToolTip';
import AppStyles from 'styles/_base.scss';
import TextPages from 'styles/components/c-text-pages.scss';
import orbcommBackgroundImage from 'assets/images/orbcomm.jpg';

class Orbcomm extends Component {

  render() {
    return (<div>
      <CoverPrimary
        title="Orbcomm Data Sublicensee License Agreement"
        backgroundImage={orbcommBackgroundImage}
        attribution="© OCEANA / Keith Ellenbogen"
      />
      <div className={StaticPageStyles['l-static-page']}>
        <div className={AppStyles.wrap}>
          <section className={TextPages['c-text-pages']}>
            <article>
              <ol className={TextPages['-orbcomm']}>
                <li>
                  <p>
                    Sublicensee has a non-exclusive, non-transferable, worldwide license
                    to use certain Automatic Identification System (“AIS”) global
                    data collected via the ORBCOMM system of AIS equipped low-Earth
                    orbit satellites and other AIS data sources (the “AIS Data”) for
                    (1) non-commercial purposes including, but not limited to, research
                    and educating the public concerning illegal fishing activity, including
                    for publishing visualizations of fishing
                    {' '}<ToolTip text="Apparent fishing" href="/definitions/fishing-effort">
                    activity
                    </ToolTip>{' '}
                    and related information; (2) to provide a limited license to unaffiliated
                    media organizations, including without limitation newspapers,
                    periodicals, broadcast media, and internet publishers, to reproduce,
                    retransmit and/or display the AIS Data for purposes of news coverage
                    and reporting; and (3) for the benefit of Sublicensee’s internal business
                    operations. For purposes of clarity and without limiting the foregoing,
                    the foregoing grant includes the rights to adapt the AIS Data: including
                    to modify, edit, combine with other materials, translate, include in
                    collective works, and create derivative works of the AIS Data.
                  </p>
                </li>
                <li>
                  <p>
                    Except as otherwise set forth herein, Sublicensee shall have
                    no other rights with respect to the AIS Data, including
                    without limitation, any right otherwise to use, distribute,
                    furnish or resell the AIS Data or any portion or derivative
                    thereof. Sublicensee may not use the AIS Data for any illegal
                    purpose or in any manner inconsistent with this sublicense
                    agreement. Except as expressly permitted pursuant to this
                    sublicense agreement, Sublicensee may not copy, reproduce,
                    republish, recompile, redeliver, decompile, disassemble,
                    reverse engineer, distribute, publish, display, modify,
                    upload, post, transmit, create derivative works from, or
                    in any other way create a misimpression or confusion
                    among users with respect to sponsorship or affiliation
                    or exploit in any way material from the AIS Data.
                  </p>
                </li>
                <li>
                  <p>
                    This sublicense agreement shall be cancelable upon
                    ninety (90) days written notice if ORBCOMM AIS LLC
                    so requests such cancellation.
                  </p>
                </li>
                <li>
                  <p>
                    The AIS Data may be protected by copyright,
                    trademark, international treaties and other
                    proprietary rights and laws of the United States and
                    other countries. Sublicensee agrees to abide by all
                    applicable intellectual property laws, as well as any
                    additional notices or restrictions contained in the AIS
                    Data. Unauthorized use of the AIS Data and the materials contained in
                    the AIS Data may violate applicable copyright, trademark
                    or other intellectual property laws or other laws and shall
                    be a breach of this sublicense agreement.
                  </p>
                </li>
                <li>
                  <p>
                    No reference to or element of intellectual
                    property of ORBCOMM AIS LLC or its affiliates,
                    including, but not limited to the AIS Data, in
                    either draft or final form, may be (a) used by
                    Sublicensee except pursuant to this sublicense
                    agreement or (b) protected by intellectual property
                    rights, for example, patented, copyrighted or trademarked,
                    by Sublicensee. In the event Sublicensee acquires
                    intellectual property rights with respect to the AIS
                    Data or otherwise obtains rights with respect thereto,
                    it shall immediately notify ORBCOMM AIS LLC in writing
                    and Sublicensee, with effect from the vesting of
                    such rights, hereby grants to ORBCOMM AIS LLC and
                    its designees a perpetual royalty‑free, world-wide license
                    to such rights, for example, patent rights including
                    rights to make, use, import and sell and have made,
                    used, imported and sold such intellectual property.
                  </p>
                </li>
                <li>
                  <p>
                  ORBCOMM AIS LLC is not liable for any unauthorized
                  use of the AIS Data. Sublicensee shall remain
                  liable for all confidential or proprietary information
                  disclosed by Sublicensee or its affiliates as a result
                  of any unauthorized use of the AIS Data. ORBCOMM AIS LLC
                  may, without notice, choose to block Sublicensee’s
                  access to the AIS Data if ORBCOMM AIS LLC has reason
                  to believe that AIS Data is being used by
                  an unauthorized person, in any manner inconsistent with
                  this sublicense agreement or for other reasons deemed
                  appropriate by ORBCOMM AIS LLC in its sole discretion.
                  </p>
                </li>
                <li>
                  <p>
                  Sublicensee acknowledges and agrees that nothing
                  in this sublicense agreement constitutes an undertaking
                  by Company and/or ORBCOMM AIS LLC to provide the AIS
                  Data in its present form or under any specifications.
                  Company and/or ORBCOMM AIS LLC, in its sole and
                  absolute discretion may from time to time make additions
                  to, deletions from, modifications to, or change the format
                  of the AIS Data.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>
                      TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NONE OF
                      ORBCOMM AIS LLC OR ANY OF ITS AFFILIATES, THEIR MEMBERS,
                      DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND CONTRACTORS
                      HAS MADE OR SHALL BE DEEMED TO HAVE MADE ANY REPRESENTATIONS
                      OR WARRANTIES WHATSOEVER WITH RESPECT TO THE AIS DATA.
                      THE AIS DATA AND INFORMATION PROVIDED BY ORBCOMM AIS LLC,
                      OR ANY OF ITS AFFILIATES, THEIR MEMBERS, DIRECTORS, OFFICERS,
                      EMPLOYEES, AGENTS, AND CONTRACTORS IS PROVIDED ON AN "AS IS"
                      BASIS, AND ORBCOMM AIS LLC EXPRESSLY DISCLAIMS ANY AND ALL WARRANTIES,
                      EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES
                      OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE
                      AND NON-INFRINGEMENT. ORBCOMM AIS LLC DOES NOT WARRANT
                      THAT THE AIS DATA WILL BE UNINTERRUPTED OR ERROR-FREE,
                      THAT DEFECTS WILL BE CORRECTED, OR THAT THE AIS DATA IS
                      FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. ORBCOMM AIS
                      LLC DOES NOT WARRANT OR REPRESENT THE USE OF THE AIS DATA
                      IN TERMS OF ITS CORRECTNESS, ACCURACY, RELIABILITY, OR OTHERWISE.
                    </strong>
                  </p>
                </li>
                <li>
                  <p>
                    Sublicensee acknowledges and agrees that the AIS Data
                    provided by ORBCOMM AIS LLC
                    may be inaccurate or incomplete and are subject to error,
                    delay or change. Reliance upon or use of such AIS Data
                    shall be at Sublicensee’s risk.
                  </p>
                </li>
                <li>
                  <p>
                    Sublicensee acknowledges that in no event
                    shall ORBCOMM AIS LLC or its affiliates
                    be liable to it for any direct, special,
                    incidental, indirect, punitive, consequential
                    damages or any other damages of any kind
                    (including, but not limited to, lost profits
                    and damages that may result from the use of
                    the AIS Data, any delay or interruption
                    of service, or omissions or inaccuracies in
                    the information) even if ORBCOMM AIS LLC or
                    any other party have been advised of the possibility thereof.
                  </p>
                </li>
                <li>
                  <p>
                    ORBCOMM AIS LLC or its affiliates will not be liable or
                    responsible in negligence or otherwise to any person not
                    a party to this sublicense agreement for (i) any information,
                    data or advice expressly or impliedly given by ORBCOMM AIS LLC
                    or (ii) any act, omission or inaccuracy by ORBCOMM AIS LLC.
                    Nothing in this sublicense agreement will be construed to create rights in favor of
                    any person not a party to this sublicense agreement other
                    than ORBCOMM AIS LLC which shall be an intended third party
                    beneficiary of this sublicense agreement.
                  </p>
                </li>
                <li>
                  <p>
                    Sublicensee shall, at its expense, indemnify, defend,
                    and hold ORBCOMM AIS LLC and its affiliates harmless
                    from and against any and all claims, losses, liabilities,
                    damages, actions, proceedings, costs, and expenses
                    (including without limitation reasonable attorney’s fees)
                    arising out of or relating to the use of the AIS Data by
                    Sublicense or its breach of this Agreement.
                  </p>
                </li>
                <li>
                  <p>
                    Sublicensee acknowledges that any
                    breach of this Agreement may cause irreparable harm
                    to ORBCOMM AIS LLC and/or Company for which monetary
                    damages may not be sufficient, and Sublicensee agrees
                    that ORBCOMM AIS LLC and/or Company will be entitled to
                    seek, in addition to its other rights and
                    remedies hereunder or at law, injunctive or all other
                    equitable relief, and such further relief as may be
                    proper from a court of competent jurisdiction.
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

export default Orbcomm;
