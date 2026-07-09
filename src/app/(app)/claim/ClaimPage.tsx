"use client";

import { useState, FormEvent } from "react";

// ============ CONFIGURE BEFORE LAUNCH ============
// Option A: point at your own API route (included: app/api/claim/route.ts)
const FORM_ENDPOINT = "/api/claim";
// Option B: use a hosted handler instead, e.g. "https://formspree.io/f/XXXXXXXX"
// Leave as "" to fall back to a pre-filled mailto (no false success shown).

const THANK_YOU_URL = ""; // optional, e.g. "/thank-you" — redirects on success
// =================================================

type Status = "idle" | "sending" | "success" | "error";

export default function ClaimPage() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Fallback mode: no endpoint configured → pre-filled email, no fake success
    if (!FORM_ENDPOINT) {
      const body =
        `Business Name: ${data.get("bizname")}\n` +
        `Contact Name: ${data.get("yourname")}\n` +
        `Phone/Email: ${data.get("contact")}\n` +
        `Trade: ${data.get("trade") || "Not specified"}\n` +
        `Notes: ${data.get("notes") || "None"}`;
      window.location.href =
        "mailto:trevor@missoulalegends.com?subject=" +
        encodeURIComponent(`Free Listing Claim — ${data.get("bizname")}`) +
        "&body=" +
        encodeURIComponent(body);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (res.ok) {
        if (THANK_YOU_URL) {
          window.location.href = THANK_YOU_URL;
          return;
        }
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <nav>
        <div className="wrap">
          <a className="logo" href="/">
            Missoula Legends
          </a>
          <a className="nav-cta" href="#claim">
            Claim My Free Listing
          </a>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="wrap">
          <span className="kicker">
            The Missoula Registry &bull; Free Listing &bull; No Catch
          </span>
          <h1 className="serif">
            You keep this town running.{" "}
            <em>The internet barely knows you exist.</em>
          </h1>
          <p className="lead">
            Missoula Legends is a free local registry of the businesses that
            actually hold this valley together — and right now that registry is
            missing its backbone: the{" "}
            <strong>
              septic crews, mechanics, plumbers, electricians, tow operators,
              and welders
            </strong>{" "}
            people call when something real breaks. I&rsquo;d like to write
            your page. It costs nothing, and it never will.
          </p>
          <a className="btn" href="#claim">
            Claim My Free Listing &rarr;
          </a>
          <span className="micro">
            Takes 2 minutes &bull; No website required &bull; A real person
            reads every submission
          </span>
          <div className="trades">
            <span>Septic &amp; Excavation</span>
            <span>Auto Repair</span>
            <span>Plumbing &amp; HVAC</span>
            <span>Electrical</span>
            <span>Towing</span>
            <span>Welding &amp; Fabrication</span>
          </div>
        </div>
      </header>

      {/* ============ THE PLAIN DEAL ============ */}
      <section className="deal">
        <div className="wrap deal-grid">
          <div>
            <span className="kicker">Why You Got That Email</span>
            <h2 className="serif deal-h2">Here&rsquo;s the whole deal, plain.</h2>
            <p>
              If you&rsquo;re reading this, I probably emailed you. Fair
              warning kicked in the second you saw the word
              &ldquo;free&rdquo; — I get it. Every week somebody tries to sell
              you a plaque, an award, or a spot in some directory nobody&rsquo;s
              ever heard of.
            </p>
            <p>
              This isn&rsquo;t that.{" "}
              <strong>
                Missoula Legends is a local guide I built to document the
                businesses that make this town what it is.
              </strong>{" "}
              The bakeries and record shops were easy — they have Instagram
              accounts. But the businesses people actually depend on? The shop
              that fixes your truck before hunting season, the guy who pumps
              your tank before it backs up, the welder who fabricates what the
              box stores can&rsquo;t order? Most of you have no website, a
              half-empty Google listing, and forty years of word-of-mouth doing
              all the work.
            </p>
            <p>
              <strong>That&rsquo;s exactly who this registry exists for.</strong>{" "}
              I write a real page about your business — what you do, how long
              you&rsquo;ve done it, how to reach you. You check it. It goes
              live. When somebody Googles your name, they find something solid
              instead of nothing.
            </p>
          </div>
          <aside className="trevor-card">
            {/* Replace the div below with your actual photo:
                <img src="/media/trevor.jpg" alt="Trevor Riggs" className="avatar" style={{ objectFit: "cover" }} /> */}
            <div className="avatar">TR</div>
            <h3>Trevor Riggs</h3>
            <div className="role">Missoula &bull; Curator, Missoula Legends</div>
            <p>
              Native Montanan. I run a small marketing shop here in town called
              True Path Digital — that&rsquo;s how I pay the bills, and
              I&rsquo;m not going to pretend otherwise. The registry is free
              and stays free. No strings, no obligation, ever. If someday you
              want help beyond the listing, you&rsquo;ll know where I am.
              That&rsquo;s the whole angle, admitted up front.
            </p>
            <p className="trevor-contact">
              <a href="mailto:trevor@missoulalegends.com">
                trevor@missoulalegends.com
              </a>
            </p>
          </aside>
        </div>
      </section>

      {/* ============ WHAT YOU GET ============ */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">What You Get</span>
            <h2 className="serif">A page that works as hard as you do.</h2>
          </div>
          <div className="cards">
            <div className="card">
              <div className="num">No. 01</div>
              <h3>A real write-up, not an ad</h3>
              <p>
                Your story, told straight — what you do, how long you&rsquo;ve
                been at it, what you&rsquo;re known for. Written by a person
                who&rsquo;s actually from here. Photo, hours, phone number,
                service area. Done.
              </p>
            </div>
            <div className="card">
              <div className="num">No. 02</div>
              <h3>Something to show when people Google you</h3>
              <p>
                No website? This page becomes the one customers find. Print it,
                link it, text it to whoever asks &ldquo;you got a
                website?&rdquo; It&rsquo;s yours to use however you want.
              </p>
            </div>
            <div className="card">
              <div className="num">No. 03</div>
              <h3>Free. Actually free. Forever.</h3>
              <p>
                No fees to join, no fees to stay, no &ldquo;premium
                tier,&rdquo; and nobody can pay to outrank you. The registry
                doesn&rsquo;t take a dime from listed businesses — that&rsquo;s
                the founding rule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROOF ============ */}
      <section className="proof">
        <div className="wrap">
          <span className="kicker">From the Registry</span>
          <blockquote>
            &ldquo;The cow is still there. So is the dairy behind it — and the
            place underneath it still runs like a neighborhood stop, not a
            destination.&rdquo;
          </blockquote>
          <div className="attr">From our feature on The Trough &bull; Target Range</div>
          <p className="names">
            Already in the registry: <b>Big Dipper Ice Cream</b> &bull;{" "}
            <b>Rockin&rsquo; Rudy&rsquo;s</b> &bull; <b>Montgomery Distillery</b>{" "}
            &bull; <b>Le Petit Bakehouse</b> &bull; <b>Fact &amp; Fiction Books</b>
            <br />
            Next up: the trades that keep all of them open.
          </p>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">How It Works</span>
            <h2 className="serif">Two minutes from you. The rest is on me.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <span className="kicker">01 / Tell Me Who You Are</span>
              <h3>Fill out the short form below</h3>
              <p>
                Business name and how to reach you. That&rsquo;s it. If
                you&rsquo;d rather just call or email, do that instead — I
                answer my own phone.
              </p>
            </div>
            <div className="step">
              <span className="kicker">02 / I Write Your Page</span>
              <h3>You check it before it goes anywhere</h3>
              <p>
                I draft your listing and send it to you first. Wrong hours?
                Hate the photo? Say so. Nothing publishes without your OK.
              </p>
            </div>
            <div className="step">
              <span className="kicker">03 / You&rsquo;re In The Registry</span>
              <h3>Live within the week</h3>
              <p>
                Your page goes up alongside the businesses Missoula already
                knows. You get the link. Use it everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CLAIM FORM ============ */}
      <section className="claim" id="claim">
        <div className="wrap claim-grid">
          <div className="claim-left">
            <span className="kicker">Claim Your Listing</span>
            <h2 className="serif">Put your business on the map it built.</h2>
            <p>
              Four fields. No website required. No social media required. No
              credit card field hiding at the end, because there&rsquo;s
              nothing to charge.
            </p>
            <ul>
              <li>Trevor reads every submission himself</li>
              <li>You&rsquo;ll hear back within 3 business days</li>
              <li>You approve everything before it goes live</li>
              <li>Changed your mind later? One email and it&rsquo;s gone</li>
            </ul>
          </div>
          <div>
            {status !== "success" && status !== "error" && (
              <form id="claimForm" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1 }}
                />
                <div className="field">
                  <label htmlFor="bizname">Business Name *</label>
                  <input
                    type="text"
                    id="bizname"
                    name="bizname"
                    required
                    placeholder="e.g., Hellgate Septic & Excavation"
                  />
                </div>
                <div className="field">
                  <label htmlFor="yourname">Your Name *</label>
                  <input
                    type="text"
                    id="yourname"
                    name="yourname"
                    required
                    placeholder="First and last"
                  />
                </div>
                <div className="field">
                  <label htmlFor="contact">
                    Phone or Email — whichever you actually check *
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    required
                    placeholder="(406) 555-0100 or you@example.com"
                  />
                </div>
                <div className="field">
                  <label htmlFor="trade">
                    Your Trade <span className="opt">(optional)</span>
                  </label>
                  <select id="trade" name="trade" defaultValue="">
                    <option value="">Pick one if you like</option>
                    <option>Auto Repair / Tires</option>
                    <option>Electrical</option>
                    <option>Plumbing / HVAC</option>
                    <option>Septic / Excavation / Dirt Work</option>
                    <option>Towing / Recovery</option>
                    <option>Welding / Fabrication</option>
                    <option>Other — I&rsquo;ll explain below</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="notes">
                    Anything I should know? <span className="opt">(optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    placeholder="How long you've been in business, what you're known for, best time to reach you..."
                  />
                </div>
                <button type="submit" className="btn" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Claim My Free Listing →"}
                </button>
                <p className="form-micro">
                  No spam, no mailing list, no text messages. This goes to
                  Trevor and nowhere else.
                </p>
              </form>
            )}

            {status === "success" && (
              <div className="success">
                <h3 className="serif">Got it. You&rsquo;re in the queue.</h3>
                <p>
                  Trevor will be in touch within 3 business days to get your
                  page started. If you don&rsquo;t hear back, email{" "}
                  <a href="mailto:trevor@missoulalegends.com">
                    trevor@missoulalegends.com
                  </a>{" "}
                  and give him hell.
                </p>
              </div>
            )}

            {status === "error" && (
              <div className="success">
                <h3 className="serif">That didn&rsquo;t go through.</h3>
                <p>
                  Technology, right? Skip the form — email{" "}
                  <a href="mailto:trevor@missoulalegends.com">
                    trevor@missoulalegends.com
                  </a>{" "}
                  and just say who you are and &ldquo;free listing.&rdquo; Same
                  result, same human reads it.
                </p>
                <p className="retry">
                  <a
                    href="#claim"
                    onClick={(e) => {
                      e.preventDefault();
                      setStatus("idle");
                    }}
                  >
                    &larr; Or try the form again
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="kicker">Fair Questions</span>
            <h2 className="serif">The stuff you&rsquo;re actually wondering.</h2>
          </div>
          <details open>
            <summary>Is this really free? What&rsquo;s the catch?</summary>
            <p>
              <strong>Yes, and here&rsquo;s the honest answer about the catch.</strong>{" "}
              I run a marketing business in town. Building this registry is how
              I meet good local businesses and give them something useful
              before I&rsquo;ve earned the right to ask for anything. Your
              listing is free forever whether we ever talk business or not. No
              follow-up sales calls, no &ldquo;upgrade&rdquo; emails. If you
              ever want help, you&rsquo;ll come to me — that&rsquo;s the bet
              I&rsquo;m making.
            </p>
          </details>
          <details>
            <summary>I don&rsquo;t have a website. Is that a problem?</summary>
            <p>
              It&rsquo;s the opposite of a problem —{" "}
              <strong>it&rsquo;s half the reason this registry exists.</strong>{" "}
              Your listing becomes the page people find when they Google your
              name. You don&rsquo;t need a website, a Facebook page, or an
              email list to be in it.
            </p>
          </details>
          <details>
            <summary>Do I have to promote it, share it, or post anything?</summary>
            <p>
              No. Some directories make you do their marketing for them. You
              don&rsquo;t have to share, post, or link to anything. It&rsquo;s
              your page; use it or ignore it.
            </p>
          </details>
          <details>
            <summary>What happens after I hit submit?</summary>
            <p>
              I read it, look up your business, and draft your page. You get it
              within a few days to check for mistakes. Once you say it&rsquo;s
              right, it goes live and I send you the link. If you&rsquo;d
              rather do the whole thing in a 10-minute phone call, just say so
              in the form.
            </p>
          </details>
          <details>
            <summary>Who decides what gets written about my business?</summary>
            <p>
              You see and approve everything before it publishes. The registry
              is editorial — meaning I write it like a story, not an ad — but
              nothing about your business goes up without your sign-off, and
              you can request changes or removal any time.
            </p>
          </details>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="final-cta">
        <div className="wrap">
          <span className="kicker">The Missoula Registry</span>
          <h2 className="serif">
            This town runs on businesses like yours. The record should say so.
          </h2>
          <p>Two minutes now. A page that works for you for years.</p>
          <a className="btn" href="#claim">
            Claim My Free Listing &rarr;
          </a>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div>
            <strong className="footer-brand">MISSOULA LEGENDS</strong>
            <br />
            An independent local registry &bull; Missoula, Montana
            <br />
            Powered by <a href="https://truepath406.com">True Path Digital</a>
          </div>
          <div className="footer-legal">
            Missoula Legends is an independent local directory and editorial
            project. Inclusion is free and does not imply endorsement or
            sponsorship. Owners may request updates, corrections, or removal at
            any time. <a href="/disclosure">Disclosure &amp; Transparency Policy</a>
          </div>
        </div>
      </footer>
    </>
  );
}
