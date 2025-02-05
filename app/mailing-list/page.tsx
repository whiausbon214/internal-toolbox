"use client";

import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const MailingListPage = () => {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(true);
  }, []);

  return (
    <Container fluid className="mt-5">
      <h1 className="text-center">ACA Mailing List</h1>
      <p className="text-center text-muted">
        Use this form to add agents not in E123 to the ACA Mailing List.
      </p>
      <div className="d-flex justify-content-center">
        {showForm && (
          <div id="mc_embed_shell">
            <link
              href="//cdn-images.mailchimp.com/embedcode/classic-061523.css"
              rel="stylesheet"
              type="text/css"
            />
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  #mc_embed_signup { 
                    background:#fff; 
                    clear:left; 
                    font:14px Helvetica,Arial,sans-serif; 
                    width: 600px; 
                  }
                `,
              }}
            />
            <div id="mc_embed_signup">
              <form
                action="https://aobgrp.us13.list-manage.com/subscribe/post?u=8636f5bdb19a439c20aa375d6&amp;id=1e948fb03b&amp;f_id=002e7de9f0"
                method="post"
                id="mc-embedded-subscribe-form"
                name="mc-embedded-subscribe-form"
                className="validate"
                target="_blank"
              >
                <div id="mc_embed_signup_scroll">
                  <h2>Subscribe</h2>
                  <div className="indicates-required">
                    <span className="asterisk">*</span> indicates required
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-EMAIL">
                      Email Address <span className="asterisk">*</span>
                    </label>
                    <input
                      type="email"
                      name="EMAIL"
                      className="required email"
                      id="mce-EMAIL"
                      required
                    />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-FNAME">First Name </label>
                    <input type="text" name="FNAME" className="text" id="mce-FNAME" />
                  </div>
                  <div className="mc-field-group">
                    <label htmlFor="mce-LNAME">Last Name </label>
                    <input type="text" name="LNAME" className="text" id="mce-LNAME" />
                  </div>
                  <div id="mce-responses" className="clear">
                    <div className="response" id="mce-error-response" style={{ display: "none" }} />
                    <div className="response" id="mce-success-response" style={{ display: "none" }} />
                  </div>
                  <div aria-hidden="true" style={{ position: "absolute", left: "-5000px" }}>
                    <input
                      type="text"
                      name="b_8636f5bdb19a439c20aa375d6_1e948fb03b"
                      tabIndex={-1}
                    />
                  </div>
                  <div className="clear">
                    <input type="submit" name="subscribe" id="mc-embedded-subscribe" className="button" value="Subscribe" />
                  </div>
                </div>
              </form>
            </div>
            <script
              type="text/javascript"
              src="//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function($) {
                    window.fnames = new Array();
                    window.ftypes = new Array();
                    fnames[0] = 'EMAIL'; ftypes[0] = 'email';
                    fnames[1] = 'FNAME'; ftypes[1] = 'text';
                    fnames[2] = 'LNAME'; ftypes[2] = 'text';
                  }(jQuery));
                  var $mcj = jQuery.noConflict(true);
                `,
              }}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default MailingListPage;
