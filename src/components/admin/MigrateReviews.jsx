import React, { useState } from 'react';
import { addReview } from '../../firebase/firestore';

// Initial reviews data to migrate
const initialReviews = [
  {
    title: "House under contract in 8 Days",
    body: `This was the second time we listed property with Tammy and there was never any question that we would list our home with her. Tammy is there to meet any challenges that might pop up when selling your home. Once we were under contract we had an issue surface. Rather than having to solve it ourselves Tammy was there to help. Without Tammy our sale could have fallen thru.

Buying or selling on St John, Tammy is the realtor you need!`,
    name: "Karen Radtke and David Carlson",
    rating: 5,
  },
  {
    title: "We have known Tammy Donnelly since spring of 2012",
    body: `After many years of visiting St. John, we decided in 2012 to purchase a property there. We did as much research online as possible. We emailed one of the realty websites with some questions, and Tammy responded. She helped us come up with a list of criteria that were important to us.

In June 2012, we rented a house on St. John and spent a lovely week there with our family. During that week, Tammy took us to look at a number of properties that met our criteria and which we had vetted online to the extent possible. Often there are challenges with a property that aren't evident until you actually see it; in our case, none of the condos we visited were a great fit for our needs. After spending two days showing us various properties, Tammy urged us to look at a condo that did not meet all of our criteria, but she felt we would like it anyway. One visit and we knew this was the condo we should buy. Tammy skillfully guided us through negotiations with the owner, through the extensive paperwork involved with purchasing a home, and helped us set up property insurance and utilities.

Furnishing our unfurnished condo would have been difficult and painful without having an agent on-island. Tammy's help was invaluable to us. We shipped furniture from our hometown, near Indianapolis, to our new condo on St. John. Tammy received our furniture from the shipping company, arranged for it to be delivered to our condo, and oversaw the process of assembling the pieces and placing them correctly in the various rooms. All we had to do was pay for it. When we arrived on St. John for our first stay as new owners of our condo, it was clean, fresh and ready to be lived in.

When we are off-island, Tammy manages our property: she has it cleaned regularly and puts up and takes down hurricane shutters when appropriate. We let her know in advance when we or other guests will visit, and she makes sure everything is ready to go.

Through the process of buying and furnishing the property, Tammy has become a good friend. She has our complete trust, and we hope to continue working with her for many years. We wholeheartedly and enthusiastically recommend Tammy Donnelly as a realtor and property manager`,
    name: "Eric Adolph and Teresa Beam, Noblesville, IN",
    rating: 5,
  },
  {
    title: "What a privilege it is to know and work alongside Tammy.",
    body: `We first met Tammy as our real estate agent in 2012. Tammy was amazingly efficient, always prompt, very well organized and never tired of chasing our whims here and there!

We are fortunate to have a continued relationship with Tammy as our On Island Coordinator for our villa rental. Tammy is always reliable and we have full confidence that any and all situations are being handled in a timely and appropriate manner.

When we converse with other islanders about our villa and the management of it we are inevitably asked about our On Island Coordinator. When we mention Tammy's name there is nothing but high praise from each and every person.

We have come to understand and appreciate why Tammy has earned this praise. We cannot say enough good things about Tammy as person, a professional, and now, a friend!`,
    name: "Cindy and Bill Humphrey, St Joseph, Missouri",
    rating: 5,
  },
  {
    title: "St John, in the USVI, is a place where most people can only imagine living.",
    body: `My family and I have had the wonderful opportunity to visit there many times over the last 15 years or so, and never thought we would be able to have a home there. Tammy Donnelly helped make it happen. Tammy, who grew up in the Virgin Islands, was extremely informative, providing us with everything we needed to know to move forward with the purchase of an island home. She made herself available to show us the properties we had interest in, to answer questions, and to provide us with names, documents and instructions on all the steps involved. She made the distance between the island and the states seem nonexistant as we proceeded with the purchase and closing from our New York state home.

Tammys' assistance did not end with the closing. Tammy continued her support, when ever asked, with professionalism and timelyness. Since we are not quite ready to retire and leave our home in the states, Tammy has helped us prepare our island home for short term rentals. Tammy has been instrumental in adding all finishing touches to our villa, and has introduced it to her website. We enjoy the positive comments from our satisfied guests on not only the villa, but Tammys' timely, informative and friendly service.

The 340 Real Estate Company is, in our opinion, one of the best sites we have seen. It is straight forward, informative, and friendly, much like Tammy herself. It is one of the few sites that allows you to put in your own criteria to search properties, and show you its actual location on the island. I urge anyone who is thinking about making the move to St John to go to www.340realestateco.com and contact Tammy Donnelly. She made it happen for us, and she can make it happen for you.`,
    name: "Michelle and Ron",
    rating: 5,
  },
  {
    title: "Sometimes with everyone's busy schedules...",
    body: `Sometimes with everyone's busy schedules we forget to take time to tell you how much we appreciated the wonderful job you do as our villa property manager. We couldn't ask for a nicer person to work with, you are so well organized, trust worthy, patient and always helpful to us as well as guests. Thank you so much for all you do to make our villa seem like home`,
    name: "Brenda and Steve",
    rating: 5,
  },
  {
    title: "It's no coincidence...",
    body: `It's no coincidence that everyone who works with Tammy has similar, positive experiences. She is awesome!

We have been frequent visitors to St John over the past 15 years, and have known Tammy as a friend for much of that time. When we decided to purchase, Tammy went out of her way to show us properties. We saw quite a range, and in each case Tammy listened, and remained objective and steady during our engagement. Despite our friendship, she seamlessly maintained professionalism and ethical standards throughout our process.

Tammy brings a unique perspective as a realtor on St. John because in addition to home sales, she also provides villa rental and property maintenance services. She can see through the marketing and provide rare insight into what it takes to maintain a home on the island. She is rooted, and actively engaged in the community. Tammy has been a past president of the St John real estate council.

We cannot say enough wonderful things about Tammy, and our experience working with her to purchase a home on St John. You will be confident that your needs are exceeded, and well satisfied with your experience! She's the BEST!`,
    name: "Nick, Jodi, and family",
    rating: 5,
  },
  {
    title: "Singing Tammy's Praises………",
    body: `Tammy Donnelly is not only an exceptional real estate professional but a new friend and neighbor! I hope this testimonial is one way to express our extreme gratitude…

Our family decided in July 2017 to move to St. John. Of course we had no idea what mother nature had in store that would significantly test these plans. Not only did our younger daughter endure hurricanes Irma & Maria with many of our island friends, but we survived hurricane Harvey in Houston as we attempted to sell our family home of 20 years. When I finally arrived on island, late September as commercial flights were once again allowed to land in St. Thomas, I was fortunate to have a place to stay. Our daughter's apartment in Pastory was no longer livable so a dear friend offered us her cottage in Fish Bay for a few weeks. Post hurricanes the island looked so very different so we decided to just take it all in and not to be deterred. We volunteered to help friends clean homes and businesses and take it one day at a time. By early October (within a few weeks) on our morning walks we happened upon a house that met all our lot/house criteria… "we would like to see the ocean, hear the waves and feel the breeze".

Working with Tammy Donnelly and Jennifer Doran, of 340 Real Estate, next steps were to make an offer and ultimately arrive at the final price. The seller's agent was not very cooperative so we relied heavily on these two power women to help us through the process (very different from the stateside process). Tammy also has great connections to lenders if a mortgage is required. We were lender approved and in contract by end of October.

The story does not end here. We still did not have electricity in Estate Fish Bay and yet we closed on the house December 5th!

Finally and most appreciated, Tammy and Jenny made sure we had a place to stay on island for 7 weeks until we could move in… Ladies my family and I are forever in your debt. So delighted to call you friend, neighbor and agent/broker.`,
    name: "A.",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `TAMMY is a very good real estate agent who knows the area and laws to get the job completed. I would refer her in an instant and use her again if I needed her services. Highly recommended!`,
    name: "Denise Barbier",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy was so helpful while we were buying our villa on St John. We had been thinking about buying for years, but after working with Tammy, we felt so better prepared for the ownership. It has been over 6 months since our purchase and we could not be happier!`,
    name: "Lynn Hood",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy is very professional and knowledgeable about the market on St John! She kept me informed on all new properties coming on the market so we were able to get the first offer in on our new Villa! This is the third time I have used Tammy for my Realestate needs on St John! If you are looking for someone with the best knowledge of the market on St John and outstanding personal follow up choose Tammy!`,
    name: "mchamberlain550",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `There is no one on island that has more knowledge of the "ins and outs" of real estate in the USVI. Numerous transactions with Tammy, of which they are all unique, and she masterfully handled everything. Once she has an understanding of your wants she is excellent at vetting properties and providing info. She also has a very calm demeanor and takes on any task with that approach and it certainly keeps you sane. Honest, trustworthy and an absolute pleasure to work with.`,
    name: "Donald McNaught",
    rating: 5,
  },
  {
    title: "Highly likely to recommend",
    body: `Tammy did an outstanding job. Her experience and knowledge of the area made the sale of our home and transition to new owners seamless. She is responsive and guided us through the entire process.`,
    name: "lcsummerhouse",
    rating: 5,
  },
];

const MigrateReviews = () => {
  const [migrating, setMigrating] = useState(false);
  const [progress, setProgress] = useState({ total: 0, success: 0, failed: 0 });
  const [logs, setLogs] = useState([]);
  const [completed, setCompleted] = useState(false);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const migrateAllReviews = async () => {
    setMigrating(true);
    setCompleted(false);
    setProgress({ total: initialReviews.length, success: 0, failed: 0 });
    setLogs([]);
    
    addLog(`Starting migration of ${initialReviews.length} reviews...`, 'info');

    for (let i = 0; i < initialReviews.length; i++) {
      const review = initialReviews[i];
      try {
        const result = await addReview(review);
        if (result.success) {
          setProgress(prev => ({ ...prev, success: prev.success + 1 }));
          addLog(`✅ [${i + 1}/${initialReviews.length}] Migrated: "${review.name}"`, 'success');
        } else {
          setProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
          addLog(`❌ [${i + 1}/${initialReviews.length}] Failed: "${review.name}" - ${result.error}`, 'error');
        }
      } catch (error) {
        setProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
        addLog(`❌ [${i + 1}/${initialReviews.length}] Error: "${review.name}" - ${error.message}`, 'error');
      }
      
      // Small delay to avoid overwhelming Firestore
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addLog('Migration completed!', 'info');
    setMigrating(false);
    setCompleted(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Migrate Reviews to Firestore</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Important:</strong> This will migrate {initialReviews.length} reviews to your Firestore database.
            Make sure your Firestore security rules allow writes to the 'reviews' collection.
          </p>
        </div>

        {!migrating && !completed && (
          <button
            onClick={migrateAllReviews}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Start Migration
          </button>
        )}

        {migrating && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {progress.success + progress.failed} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${((progress.success + progress.failed) / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {(migrating || completed) && (
          <div className="mt-6">
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{progress.success}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{progress.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{progress.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-2">Migration Log:</h3>
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`text-sm py-1 ${
                    log.type === 'success' ? 'text-green-700' :
                    log.type === 'error' ? 'text-red-700' :
                    'text-gray-700'
                  }`}
                >
                  <span className="text-gray-500 text-xs">[{log.timestamp}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">
              ✅ Migration completed! Check the Firestore console and your reviews page to verify.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrateReviews;
