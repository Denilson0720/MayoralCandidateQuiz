
export interface CandidateExplanation {
  candidate: string;
  explanation: string;
  source: string;
  sourceLink?: string;
  sourceTitle?: string;
  remark?: string;
}

export interface Option {
    text: string;
    candidates: string[];
    explanations?: CandidateExplanation[];
  }
  
export interface Question {
    id: number;
    subtopic: string;
    question: string;
    options: Option[];
  }
export const questions: Question[] = [
    {
      id: 0,
      subtopic: "Street Usage",
      question: "How should Jersey City balance its streets among drivers, cyclists, and pedestrians to improve safety and mobility?",
      options: [
        {
          text: "Prioritize community-centered design: expand safe walking routes, invest in protected bike lanes, and integrate green infrastructure while ensuring neighborhood input in street changes.",
          candidates: ["Mussab Ali"],
          explanations: [
            {
              candidate: "Mussab Ali",
              explanation: `"He frames congestion pricing revenue as an opportunity to fund bike lanes, pedestrian improvements, and local road upgrades, rather than unnecessary highway expansions."`,
              remark: "Hudson County View",
              source: "Mussab Ali's platform",
              sourceLink: "https://hudsoncountyview.com/op-ed-congestion-pricing-is-a-burden-for-jersey-city-but-its-also-an-opportunity/",
              sourceTitle: "Hudson County View"
            }
          ]
        },
        {
          text: "Focus on stricter enforcement: reintroduce traffic enforcement units and advocate for speed cameras in school zones and high-risk areas.",
          candidates: ["James Solomon"],
          explanations: [
            {
              candidate: "James Solomon",
              explanation: `James Solomon supports automated traffic enforcement like speed cameras in school zones and is in favor of reviving traffic enforcement units to improve safety.`,
              remark:'James Solomon',
              source: "James Solomon's platform",
              sourceLink:'https://solomonforjc.com/transit-policy/',
              sourceTitle:'solomonforjc.com'
            }
          ]
        },
        {
          text: "Improve driver experience and accessibility by expanding parking, repaving roads, and synchronizing traffic lights.",
          candidates: ["Jim McGreevy", "Bill Odea"],
          explanations: [
            {
              candidate: "Jim McGreevy and Bill Odea",
              explanation: `Jim McGreevy and Bill Odea have spoken about modernizing roads, repaving aging infrastructure, and addressing parking availability to improve overall traffic flow and accessibility for drivers.`,
              source: "Jim McGreevy and Bill Odea's statements"
            }
          ]
        },
        {
          text: "Ensure every neighborhood—especially underserved ones—gets safer streets, better sidewalks, and improved transit access.",
          candidates: ["Joyce Watterman"],
          explanations: [
            {
              candidate: "Joyce Watterman",
              explanation: `Joyce Watterman emphasizes equitable infrastructure upgrades across neighborhoods. She wants to ensure underserved areas get sidewalk repairs, street safety improvements, and expanded transit access.`,
              source: "Joyce Watterman's platform"
            }
          ]
        }
      ]
    },
    {
      id: 1,
      subtopic: "Transportation",
      question: "What should be the top priority for improving transportation in Jersey City?",
      options: [
        {
          text: "Expanding public transit options",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { 
              candidate: "Mussab Ali", 
              explanation: `Mussab commits to modernizing bus routes, expanding light rail, and funding local transit with new revenue streams. "His proposed free city bus network would consist of four backbone routes, connecting Journal Square and Downtown with the Heights, the west side, Bergen-Lafayette, and Greenville."`, 
              remark: "Hudson County View",
              source: "Mussab Ali's platform",
              sourceLink: "https://hudsoncountyview.com/ali-wants-free-jersey-city-bus-network-as-mayor-i-will-fight-for-innovative-ideas/?utm_source=chatgpt.com",
              sourceTitle: "Hudson County View"
            },
            { candidate: "James Solomon",
              explanation: `James Solomon supports increased investment in PATH and bus service expansion to reduce car dependence.`,
              source: "James Solomon's platform",
              sourceLink: "https://www.jamesforjerseycity.com/transportation/",
              sourceTitle: "solomonforjc.com"
            }
          ]
        },
        {
          text: "Easing car traffic and parking",
          candidates: ["Bill Odea", "Jim McGreevy"],
          explanations: [
            { candidate: "Bill Odea", explanation: `Bill Odea has prioritized easing congestion and increasing parking options across the city.`, source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" },
            { candidate: "Jim McGreevy", explanation: `Jim McGreevy supports traffic efficiency improvements and better parking management to reduce frustration for drivers.`, source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Add protected bike lanes and pedestrian walkways",
          candidates: ["James Solomon", "Mussab Ali"],
          explanations: [
            { candidate: "James Solomon", explanation: `James Solomon consistently supports protected bike lanes and expanding pedestrian infrastructure.`, source: "James Solomon's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" },
            { 
              candidate: "Mussab Ali", 
              explanation: `"Instead of building more lanes over our heads, our tax and toll money should be invested in Jersey City's infrastructure of tomorrow, including local roads, bus and light rail, bike and pedestrian infrastructure, and more."`, 
              remark: 'Mussab Ali',
              source: "Mussab Ali's platform",
              sourceLink: "https://hudsoncountyview.com/op-ed-congestion-pricing-is-a-burden-for-jersey-city-but-its-also-an-opportunity",
              sourceTitle: "Hudson County View"
            }
          ]
        },
        {
          text: "Promote transit-oriented development to reduce car reliance",
          candidates: ["Mussab Ali"],
          explanations: [
            { 
              candidate: "Mussab Ali", 
              explanation: `"Oppose the I-78 expansion. There has never been a need to expand I-78. NJDOT's own research shows that I-78 hasn't needed repairs for forty years and that low-cost alternatives would better maintain the road."`, 
              remark:'Mussab Ali',
              source: "Mussab Ali's platform",
              sourceLink: "https://hudsoncountyview.com/op-ed-congestion-pricing-is-a-burden-for-jersey-city-but-its-also-an-opportunity",
              sourceTitle: "Hudson County View"
            }
          ]
        }
      ]
    },
    // TO BE DETERMINED
    {
      id: 2,
      subtopic: "Public Safety",
      question: "What approach should the city take to keep neighborhoods safe?",
      options: [
        {
          text: "Increase and improve police presence",
          candidates: ["Bill Odea", "Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevey", explanation: "McGreevey, in particular, has called for bringing back the police gang task force to address crime proactively.", source: "Bill O'Dea and Jim McGreevey's statements",
              remark:'Jim McGreevy',
              sourceLink:'https://www.mcgreeveyforjerseycity.com',
              sourceTitle:'mcgreeveyforjerseycity.com'
            },
            {candidate:'Mussab Ali',explanation:`"Mussab will advocate for increased training in de-escalation skills and tactics for law enforcement agencies, support the expansion of law enforcement training funds, and ensure citywide consistency in police training and accountability standards"`,
              source:"Mussab Ali's platform",
              sourceLink:'https://drive.google.com/file/d/1ebRkitIHvhjSeWpuX11psszuQrj7E45F/view',
              sourceTitle:'mussabali.com'
            }
          ]
        },
        {
          text: "Pair mental-health crisis teams with JCPD back-up when necessary",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: 'Mussab Ali advocates for growing non-police emergency responder programs, with trained crisis teams that center de-escalation and care rather than enforcement, and believes that the police should be the back-up for these teams when necessary. "Mussab will work to expand the ARRIVE program to 7 days a week so that mental health services and support systems are available to the community every day of the week" ', source: "Mussab Ali's platform",
              remark:'Mussab Ali Campaign',
              sourceLink:'https://drive.google.com/fileg/d/1ebRkitIHvhjSeWpuX11psszuQrj7E45F/view',
              sourceTitle:'mussabali.com'
            }
          ]
        },
        // {
        //   text: "Mix of both A and B",
        //   candidates: ["Joyce Watterman"],
        //   explanations: [
        //     { candidate: "Joyce Watterman", explanation: "Joyce Watterman has stated that safety requires both strong policing and strong community support. Her approach combines neighborhood investment with continued funding for law enforcement.", source: "Joyce Watterman's platform" }
        //   ]
        // }, 
        {
          text: "Reallocate some police funding toward mental health services",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon has supported reallocating some public safety funding to create a non-police mental health response team, emphasizing that public safety includes mental health care.", source: "James Solomon's platform",
              remark:'James Solomon',
              sourceLink:'https://solomonforjc.com',
              sourceTitle:'solomonforjc.com'
            }
          ]
        },
        {
          text: "Invest in youth and neighborhood programs to prevent violence before it starts whilst mentoring our youth",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali",
               explanation: "Mussab Ali centers his safety platform on youth-focused prevention — including violence interruption programs and support for youth development — to address the root causes of crime before they escalate. Part of Mussab's plan is to reinstate The Jersey City Summer Internship Program(JCSI) which placed hundreds of Jersey City high school students in paid internships at leading corporations.",
               source: "Mussab Ali's platform",
               sourceLink:"https://drive.google.com/file/d/1ebRkitIHvhjSeWpuX11psszuQrj7E45F/view",
               sourceTitle: "mussabali.com"
            }
          ]
        }

      ]
    },
    // {
    //   id: 3,
    //   subtopic: "Emergency Calls",
    //   question: "Who should respond to non-violent 911 calls involving mental health or substance abuse?",
    //   options: [
    //     // {
    //     //   text: "Specially trained clinicians",
    //     //   candidates: ["Mussab Ali", "James Solomon"],
    //     //   explanations: [
    //     //     { candidate: "Mussab Ali", explanation: "Both Mussab Ali and James Solomon support alternative crisis response models where trained professionals — not armed officers — handle non-violent emergencies. This includes clinicians equipped to de-escalate situations involving mental health." },
    //     //     { candidate: "James Solomon", explanation: "Both Mussab Ali and James Solomon support alternative crisis response models where trained professionals — not armed officers — handle non-violent emergencies. This includes clinicians equipped to de-escalate situations involving mental health." }
    //     //   ]
    //     // },
    //     {
    //       text: "Police officer",
    //       candidates: ["Bill Odea"],
    //       explanations: [
    //         { candidate: "Bill Odea", explanation: "Bill O'Dea believes that police should continue to be the primary responders for all emergency calls, including mental health-related incidents.", source: "Bill O'Dea's platform" }
    //       ]
    //     },
    //     {
    //       text: "Coordinated team",
    //       candidates: ["Jim McGreevy", "Joyce Watterman"],
    //       explanations: [
    //         { candidate: "Jim McGreevy and Joyce Watterman", explanation: "McGreevey and Watterman favor team-based approaches that may include police and health professionals. McGreevey has talked about strengthening coordination between law enforcement and service providers.", source: "Jim McGreevy and Joyce Watterman's statements" }
    //       ]
    //     },
    //     {
    //       text: "Community-based response centers",
    //       candidates: ["James Solomon"],
    //       explanations: [
    //         { candidate: "James Solomon", explanation: "James Solomon has proposed creating local, community-led emergency response hubs to dispatch trained professionals for mental health and substance abuse crises.", source: "James Solomon's platform" }
    //       ]
    //     },
    //     {
    //       text: "Expand non-police emergency response units ",
    //       candidates: ["Mussab Ali"],
    //       explanations: [
    //         { candidate: "Mussab Ali", explanation: "Mussab Ali advocates for growing non-police emergency responder programs, with trained crisis teams that center de-escalation and care rather than enforcement.", source: "Mussab Ali's platform" }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   id: 3,
    //   subtopic: "Housing Affordability",
    //   question: "How can Jersey City best address rising housing costs?",
    //   options: [
    //     {
    //       text: "Requiring more affordable units in new developments",
    //       candidates: ["Mussab Ali", "James Solomon", "Joyce Watterman"],
    //       explanations: [
    //         { candidate: "Mussab Ali", explanation: '"Require 20% of all new towers to be deeply affordable units."',remark:"Mussab Ali", source: "Mussab Ali's platform" },
    //         { candidate: "James Solomon", explanation: " Solomon backs enforcement of existing mandates.", source: "James Solomon's platform" },
    //         { candidate: "Joyce Watterman", explanation: " Watterman emphasizes increasing affordable housing through new construction.", source: "Joyce Watterman's platform" }
    //       ]
    //     },
    //     {
    //       text: "Strengthening rent controls",
    //       candidates: ["James Solomon", "Jim McGreevy"],
    //       explanations: [
    //         { candidate: "James Solomon", explanation: "James Solomon wants to expand rent control protections and close loopholes that allow landlords to hike rents.", source: "James Solomon's platform" },
    //         { candidate: "Jim McGreevy", explanation: "McGreevey supports defending and strengthening rent control as part of a broader housing stability platform.", source: "Jim McGreevy's platform" }
    //       ]
    //     },
    //     {
    //       text: "Encouraging more overall housing construction",
    //       candidates: ["Bill Odea"],
    //       explanations: [
    //         { candidate: "Bill Odea", explanation: "Bill O'Dea believes increasing the total housing supply is essential. He supports policies that incentivize development across the city to meet growing demand and relieve market pressure.", source: "Bill Odea's platform" }
    //       ]
    //     },
    //     {
    //       text: "Provide rental subsidies and housing vouchers",
    //       candidates: ["Jim McGreevy"],
    //       explanations: [
    //         { candidate: "Jim McGreevy", explanation: "Jim McGreevey emphasizes direct financial assistance to low-income renters, including increased use of housing vouchers and subsidies to prevent displacement.", source: "Jim McGreevy's platform" }
    //       ]
    //     },
    //     {
    //       text: "Ensure new development includes deeply affordable units and protects against displacement",
    //       candidates: ["Mussab Ali"],
    //       explanations: [
    //         { candidate: "Mussab Ali", explanation: "Mussab Ali supports ensuring affordability is not just token, but tied to actual area incomes. He also proposes legal support for tenants and anti-displacement strategies.", source: "Mussab Ali's platform" }
    //       ]
    //     }
    //   ]
    // },
    // RUSSAB DEFINED
    {
      id: 3,
      subtopic: "Housing Affordability",
      question: "How can Jersey City best address rising housing costs?",
      options: [
        {
          text: "Stop displacement with rent-stabilization + right-to-counsel.",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: '"Mussab Ali will strictly enforce Chapter 260, the city’s rent control law, which has gone largely ignored. Rent is up over 50% since 2015. But if rent control had been enforced the way it’s supposed to be, the legal increase would have been closer to 20%. That gap is costing Jersey City renters as much as $51 million every year. Ali\'s plan pledges for stronger enforcement, stiffer penalties, and a public rent control database so renters can know their rights before they sign a lease. "', source: "Mussab Ali's platform",
              remark:'Mussab Ali Campaign',
              sourceLink:'https://www.ali2025.com/housing',
              sourceTitle:'ali2025.com'
            },
          ]
        },
        {text:'Stronger rent cap',
          candidates:["James Solomon"],
          explanations:[
            {candidate:'James Solomon',explanation:'James Solomon wants to expand rent control protections and close loopholes that allow landlords to hike rents.',source:'James Solomon\'s platform', sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com"}
          ]
        },
        {
          text: "Build as much as possible.",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill O'Dea believes increasing the total housing supply is essential. He supports policies that incentivize development across the city to meet growing demand and relieve market pressure.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "Expand vouchers",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "Jim McGreevey emphasizes direct financial assistance to low-income renters, including increased use of housing vouchers and subsidies to prevent displacement.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Require 20% of all new towers to be deeply affordable units.",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: '"Every new project of more than two units will be mandated to have 25 percent permanent affordable housing."',remark:"Mussab Ali", source: "Mussab Ali's platform",
              sourceLink:'https://hudsoncountyview.com/ali-pledges-to-end-exclusionary-zoning-as-part-of-his-jersey-city-housing-plan/?utm_source=chatgpt.com',
              sourceTitle:'hudsoncountyview.com'
            },
          ]
        },
        // {
        //   text: "Ensure new development includes deeply affordable units and protects against displacement",
        //   candidates: ["Mussab Ali"],
        //   explanations: [
        //     { candidate: "Mussab Ali", explanation: "Mussab Ali supports ensuring affordability is not just token, but tied to actual area incomes. He also proposes legal support for tenants and anti-displacement strategies.", source: "Mussab Ali's platform" }
        //   ]
        // }
      ]
    },
    {
      id: 4,
      subtopic: "Development and Gentrification",
      question: "What is the best way for Jersey City to manage new development?",
      options: [
        {
          text: "Encourage growth to add housing",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill O'Dea emphasizes the importance of continued development to grow the city's housing stock and generate economic activity.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "Limit development to prevent gentrification",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon has proposed zoning reforms to slow luxury development in historically working-class neighborhoods to reduce displacement and maintain affordability.", source: "James Solomon's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" }
          ]
        },
        {
          text: "Demand community benefits from developers",
          candidates: ["Mussab Ali", "Joyce Watterman"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Ali pledged to upzone R-1 to R-2 and require 25% affordable units in new developments, ensuring projects directly serve communities rather than purely profit motives.", source: "Mussab Ali's platform",sourceLink:'https://hudsoncountyview.com/ali-pledges-to-end-exclusionary-zoning-as-part-of-his-jersey-city-housing-plan',sourceTitle:'hudsoncountyview.com'},
            { candidate: "Joyce Watterman", explanation: "Both Mussab Ali and Joyce Watterman call for negotiating strong community benefits agreements with developers. Watterman stresses equitable development that includes amenities for existing residents.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        },
        {
          text: "Tie development to affordability and sustainability",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: '"Ali’s plan would rezone all R-1 areas in Jersey City to R-2, ending single-family-only zoning and allowing for the construction of modest apartment buildings up to four stories tall. This change would include a 25% affordability requirement built into new developments in rezoned areas above two stories."', source: "Mussab Ali's platform",remark:'Mussab Ali Campaign',sourceLink:'https://www.ali2025.com/housing',sourceTitle:'ali2025.com' }
          ]
        }
      ]
    },
    // RUSSAB DEFINED
    // {
    //   id: 5,
    //   subtopic: "Education Quality",
    //   question: "What is the key to improving public schools in Jersey City?",
    //   options: [
    //     {
    //       text: "Increasing funding and resources (teachers, facilities)",
    //       candidates: ["Mussab Ali", "Joyce Watterman"],
    //       explanations: [
    //         { candidate: "Mussab Ali", explanation: "Mussab Ali emphasizes equitable funding, improving school infrastructure, and hiring more teachers to support student learning.", source: "Mussab Ali's platform" },
    //         { candidate: "Joyce Watterman", explanation: "Watterman supports improving public school quality through investment and equity.", source: "Joyce Watterman's platform" }
    //       ]
    //     },
    //     {
    //       text: "Reforming school management",
    //       candidates: ["Bill Odea"],
    //       explanations: [
    //         { candidate: "Bill Odea", explanation: "Odea advocates for greater school oversight and critiques current management structures, which aligns with a call for reform.", source: "Bill Odea's platform" }
    //       ]
    //     },
    //     {
    //       text: "Expanding school choice options",
    //       candidates: ["James Solomon"],
    //       explanations: [
    //         { candidate: "James Solomon", explanation: "Solomon has voiced interest in giving families more educational options, including supporting some charter initiatives, which often falls under 'school choice.'", source: "James Solomon's platform" }
    //       ]
    //     },
    //     {
    //       text: "Strengthen community-school partnerships",
    //       candidates: ["Mussab Ali"],
    //       explanations: [
    //         { candidate: "Mussab Ali", explanation: "Mussab Ali's platform highlights the importance of engaging families and local communities in school success through partnerships and localized support programs.", source: "Mussab Ali's platform" }
    //       ]
    //     }
    //   ]
    // },
    {
      id: 5,
      subtopic: "Education Quality",
      question: "How should Jersey City approach public schools?",
      options: [
        {
          text:"Audit administration",
          candidates:["Bill Odea"],
          explanations:[
            {candidate:'Bill Odea',explanation:'Bill Odea wants to audit the administration of the school district to ensure that the money is being used effectively.',source:'Bill Odea\'s platform', sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com"}
          ]
        },
        {
          text: "Modernize buildings & secure full state aid.",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation:'"Mussab Ali will prioritize increased funding for public schools to ensure they have the necessary resources, including modern facilities, updated technology, and comprehensive support services. This investment will create an environment where students can thrive and teachers are empowered to deliver high-quality education."',remark:'Mussab Ali Campaign',source: "Mussab Ali's platform",sourceLink:'https://www.ali2025.com/education',sourceTitle:'ali2025.com' }
          ]
        },
        {
          text:"Expand public charter schools",
          candidates:["James Solomon"],
          explanations:[
            {candidate:'James Solomon',explanation:'James Solomon wants to expand public charter schools to give families more educational options.',source:'James Solomon\'s platform', sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com"}
          ]
        },
        {
          text: "Free after-school STEM & arts in every ward",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "The Mussab Ali campaign has expressed the importance of quality education for all students, and has pledged to provide promote and enhance STEM programs in our schools.", source: "Mussab Ali's platform",remark:'Mussab Ali Campaign',sourceLink:'https://www.ali2025.com/education',sourceTitle:'ali2025.com' }
          ]
        },
        {
          text:"Smaller class sizes",
          candidates:["Joyce Watterman"],
          explanations:[
            {candidate:'Joyce Watterman',explanation:'Joyce Watterman wants to reduce class sizes to improve the quality of education.',source:'Joyce Watterman\'s platform', sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com"}
          ]
        },
      ]
    },
    {
      id: 6,
      subtopic: "Charter Schools",
      question: "How should Jersey City approach charter schools?",
      options: [
        {
          text: "Expand them for more parent choice",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea advocates for expanding charter options as a form of school choice.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "Keep the focus on improving traditional public schools",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: 'Mussab Ali strongly favors traditional public schools and prioritizes strengthening them rather than expanding charters. “We need to invest in and strengthen our public schools so every child has access to a high-quality education, regardless of their zip code.” --Mussab Ali', source: "Mussab Ali's platform",remark:'Mussab Ali Campaign',sourceLink:'https://www.ali2025.com/education',sourceTitle:'ali2025.com' }
          ]
        },
        {
          text: "Find a balance between the two",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman supports both public and charter schools, with a goal of ensuring all students receive a quality education.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        },
        {
          text: "Increase transparency and accountability for all schools",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "Solomon advocates for holding both public and charter schools accountable through transparency and community oversight.", source: "James Solomon's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" }
          ]
        }
      ]
    },
    {
      id: 7,
      subtopic: "Immigration",
      question: "How should Jersey City support its immigrant communities?",
      options: [
        // ADD MULTIPLE LINKS TO DESCIRBE THE LAWS MUSSAB SUPPORTS
        {
          text: "Make Jersey City a stronger sanctuary city by refusing to cooperate with ICE and expanding local services and protections",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: 'Mussab has pledged to fight against all ICE raids and has emphasized the need to keep our city a sanctuary city. "As mayor, I will champion policies that protect and uplift our immigrant communities." --Mussab Ali. These policies include the NJ Immigration Trust Act, S779/A577, A5096. ', source: "Mussab Ali's platform",remark:'Mussab Ali Campaign',sourceLink:'https://hudsoncountyview.com/op-ed-jersey-city-must-stand-firm-against-ice-enforcement-mayoral-hopeful-says',sourceTitle:'hudsoncountyview.com' }
          ]
        },
        {
          text: "Establish immigrant legal aid centers",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy supports legal resources and services for vulnerable residents, including immigrants.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Promote cultural inclusion via community initiatives",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman's platform highlights unity and community building across all Jersey City neighborhoods, which includes culturally inclusive programming.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        }
      ]
    },
    // TBD
    {
      id: 8,  
      subtopic: "Healthcare Access",
      question: "What should the city do to improve healthcare for residents?",
      options: [
        {
          text: "Expand neighborhood clinics and mental health services",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali strongly supports expanding community-based clinics and increasing access to mental health services.", source: "Mussab Ali's platform" },
            { candidate: "James Solomon", explanation: "Solomon also advocates for increased access to care, including mental health, particularly through city investments.", source: "James Solomon's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" }
          ]
        },
        {
          text: "Partner with hospitals for better access",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman supports partnerships with health institutions to improve service delivery across the city.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        },
        {
          text: "Focus on public health outreach and prevention",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy prioritizes preventive healthcare and outreach, including addressing social determinants of health.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Offer mobile services in underserved areas",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali's platform mentions bringing health services to communities directly, including mobile outreach in hard-to-reach areas.", source: "Mussab Ali's platform" }
          ]
        }
      ]
    },
    // TBD, SITE NO GOOD
    {
      id: 9,
      subtopic: "Climate Resilience",
      question: "How should Jersey City address climate change and flooding risks?",
      options: [
        {
          text: "Invest in green infrastructure and emissions reduction",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali supports major investments in climate resilience, including stormwater infrastructure, emissions reduction, and sustainable building practices. He emphasizes creating a climate action plan focused on equity and long-term impact.", source: "Mussab Ali's platform" }
          ]
        },
        {
          text: "Strengthen flood defenses",
          candidates: ["James Solomon", "Bill Odea"],
          explanations: [
            { candidate: "James Solomon and Bill Odea", explanation: "James Solomon has called for more serious investment in flood infrastructure, including better drainage and proactive storm protection. Bill Odea has emphasized updating sewer systems and addressing stormwater issues as critical to the city's resilience.", source: "James Solomon's platform and Bill Odea's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" }
          ]
        },
        {
          text: "Focus on other immediate issues first",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "There is no clear position from McGreevy on prioritizing climate resilience; his platform emphasizes other areas like affordability and public safety. This response reflects the absence of a stated climate-first focus.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Use development regulations to encourage sustainability",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab's platform calls for tying development to climate goals—including stricter sustainability guidelines, green building incentives, and stormwater management requirements.", source: "Mussab Ali's platform" }
          ]
        }
      ]
    },
    {
        id: 10,
      subtopic: "Turnpike Expansion",
      question: "How should the city respond to the state’s proposal to widen the NJ Turnpike extension near downtown?",
      options: [
        {
          text: "Support it to reduce traffic",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill Odea has stated that he supports widening the Turnpike extension as a way to reduce congestion. He has emphasized improving vehicle flow and infrastructure upgrades in the region.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "Oppose it over environmental concerns",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            // { candidate: "Mussab Ali and James Solomon", explanation: "Both Mussab Ali and James Solomon have publicly opposed the Turnpike expansion. Mussab frames it as an outdated, car-centric plan that undermines climate goals, while Solomon has criticized it for failing to align with Jersey City's sustainability commitments.", source: "Mussab Ali's platform and James Solomon's platform" }
            {candidate:'Mussab Ali',explanation:'"Instead of building more lanes over our heads, our tax and toll money should be invested in Jersey City’s infrastructure of tomorrow, including local roads, bus and light rail, bike and pedestrian infrastructure, and more." --Mussab Ali',source:'Mussab Ali\'s platform',remark:'Mussab Ali Campaign',sourceLink:'https://hudsoncountyview.com/op-ed-congestion-pricing-is-a-burden-for-jersey-city-but-its-also-an-opportunity/',sourceTitle:'hudsoncountyview.com'},
            {candidate:'James Solomon',explanation:'"James Solomon has expressed concerns about the environmental impact of the Turnpike expansion, particularly the potential for increased noise and air pollution. He has also called for a more comprehensive plan that includes public transportation and bike infrastructure."',source:'James Solomon\'s platform',remark:'James Solomon Campaign',sourceLink:'https://www.jamesforjerseycity.com/issues/turnpike-expansion/',sourceTitle:'jamesforjerseycity.com'},
          ]
        },
        {
          text: "Seek changes to the plan",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman has not explicitly opposed the project, but she has suggested the city should push for revisions or mitigations that reflect local concerns, including traffic and environmental impacts.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        },
        {
          text: "Remain neutral until more data is available",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy has not taken a firm position on the Turnpike expansion; his materials do not express opposition or support, so a 'wait and assess' stance aligns with the data.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        }
      ]
    },
    {
      id: 11, 
      subtopic: "Government Collaboration",
      question: "What approach should Jersey City take in working with state and federal governments?",
      options: [
        {
          text: "Aggressively lobby for more funding",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali has emphasized leveraging state and federal resources to bring investment into Jersey City, particularly in underserved neighborhoods.", source: "Mussab Ali's platform", sourceLink: "https://www.ali2025.com/", sourceTitle: "ali2025.com" }
          ]
        },
        {
          text: "Build collaborative relationships",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy's experience in various levels of government suggests a preference for traditional intergovernmental collaboration.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "Rely mainly on local resources",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea has focused his platform on local government accountability and has expressed skepticism about relying too heavily on outside support.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "Use both state support and grassroots planning",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab supports combining top-down funding with bottom-up community input, including participatory budgeting and coalition-building with local organizers.", source: "Mussab Ali's platform", sourceLink: "https://www.ali2025.com/", sourceTitle: "ali2025.com" }
          ]
        }
      ]
    },
    {
      id: 12,
      subtopic: "Leadership Style",
      question: "What type of leadership does Jersey City need in its next mayor?",
      options: [
        {
          text: "A seasoned insider with experience",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea emphasizes his decades of government experience and familiarity with city operations.", source: "Bill Odea's platform", sourceLink: "https://www.billodeajc.com/", sourceTitle: "billodeajc.com" }
          ]
        },
        {
          text: "A fresh outsider with new ideas",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy frames himself as a new face in the race, ready to challenge the status quo.", source: "Jim McGreevy's platform", sourceLink: "https://jimmcgreevy.com", sourceTitle: "jimmcgreevy.com" }
          ]
        },
        {
          text: "A community-driven coalition-builder",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab positions himself as a grassroots leader focused on organizing community voices and building inclusive governance structures.", source: "Mussab Ali's platform", sourceLink: "https://www.ali2025.com/", sourceTitle: "ali2025.com" }
          ]
        },
        {
          text: "A strict manager focused on efficiency",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman has pitched herself as a no-nonsense manager ready to run the city efficiently.", source: "Joyce Watterman's platform", sourceLink: "https://www.joyceforjc.com/", sourceTitle: "joyceforjc.com" }
          ]
        }
      ]
    },
    {
      id: 13,
      subtopic: "Transparency and Trust",
      question: "How can City Hall be made more transparent and accountable?",
      options: [
        {
          text: "By enacting tougher ethics rules and limiting influence of developers/donors",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "Solomon has made political reform and reducing developer influence key to his platform.", source: "James Solomon's platform", sourceLink: "https://www.jamesforjerseycity.com/", sourceTitle: "jamesforjerseycity.com" }
          ]
        },
        {
          text: "By improving open data and communication",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: 'Mussab supports increasing access to public information, including budget transparency, and simplifying communication between residents and City Hall."“Jersey City deserves leadership that puts residents first—not political insiders or campaign donors. I am running for office to bring honesty, transparency, and accountability to City Hall. That starts with changing how our city does business.” -- Mussab Ali"',remark:'Mussab Ali Campaign',source: "Mussab Ali's platform",sourceLink:'https://jcitytimes.com/mussab-ali-releases-clean-government-pledge-to-reject-pay-to-play-contributions-in-jc-mayoral-race/',sourceTitle:'jcitytimes.com' }
          ]
        },
        {
          text: "By maintaining the current oversight with no major changes",
          candidates: [],
          explanations: []
        },
        {
          text: "Impose term limits and clean campaign rules",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation:'"He says that if elected, he will establish a clear, public, and competitive bidding process for all vendor selections, create meaningful barriers to pay-to-play practices (within the limits of the law) and ensure every dollar spent serves the public – not political insiders." -- Hudson County View',remark:'Hudson County View',source: "Mussab Ali's platform",sourceLink:'https://hudsoncountyview.com/ali-i-wont-take-donations-from-any-jersey-city-contractors-over-the-past-2-years',sourceTitle:'hudsoncountyview.com' }
          ]
        }
      ]
    }
  ];