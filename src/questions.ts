
export interface CandidateExplanation {
  candidate: string;
  explanation: string;
}

export interface Option {
    text: string;
    candidates: string[];
    explanations?: CandidateExplanation[];
  }
  
export interface Question {
    id: number;
    question: string;
    options: Option[];
  }
export const questions: Question[] = [
    {
      id: 0,
      question: "Street Usage: How should Jersey City balance its streets among drivers, cyclists, and pedestrians to improve safety and mobility?",
      options: [
        {
          text: "Prioritize community-centered design: expand safe walking routes, invest in protected bike lanes, and integrate green infrastructure while ensuring neighborhood input in street changes.",
          candidates: ["Mussab Ali"],
          explanations: [
            {
              candidate: "Mussab Ali",
              explanation: `Mussab Ali plans on reshaping streets to prioritize pedestrians and cyclists. He supports building protected bike lanes, pedestrian plazas, and implementing traffic calming, with community engagement in redesign efforts.`
            }
          ]
        },
        {
          text: "Focus on stricter enforcement: reintroduce traffic enforcement units and advocate for speed cameras in school zones and high-risk areas.",
          candidates: ["James Solomon"],
          explanations: [
            {
              candidate: "James Solomon",
              explanation: `James Solomon supports automated traffic enforcement like speed cameras in school zones and is in favor of reviving traffic enforcement units to improve safety.`
            }
          ]
        },
        {
          text: "Improve driver experience and accessibility by expanding parking, repaving roads, and synchronizing traffic lights.",
          candidates: ["Jim McGreevy", "Bill Odea"],
          explanations: [
            {
              candidate: "Jim McGreevy and Bill Odea",
              explanation: `Jim McGreevy and Bill Odea have spoken about modernizing roads, repaving aging infrastructure, and addressing parking availability to improve overall traffic flow and accessibility for drivers.`
            }
          ]
        },
        {
          text: "Ensure every neighborhood—especially underserved ones—gets safer streets, better sidewalks, and improved transit access.",
          candidates: ["Joyce Watterman"],
          explanations: [
            {
              candidate: "Joyce Watterman",
              explanation: `Joyce Watterman emphasizes equitable infrastructure upgrades across neighborhoods. She wants to ensure underserved areas get sidewalk repairs, street safety improvements, and expanded transit access.`
            }
          ]
        }
      ]
    },
    {
      id: 1,
      question: "Transportation: What should be the top priority for improving transportation in Jersey City?",
      options: [
        {
          text: "Expanding public transit options",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali", explanation: `Mussab Ali advocates for strengthening bus service, exploring ferry options, and improving light rail connectivity.` },
            { candidate: "James Solomon", explanation: `James Solomon supports increased investment in PATH and bus service expansion to reduce car dependence.` }
          ]
        },
        {
          text: "Easing car traffic and parking",
          candidates: ["Bill Odea", "Jim McGreevy"],
          explanations: [
            { candidate: "Bill Odea", explanation: `Bill Odea has prioritized easing congestion and increasing parking options across the city.` },
            { candidate: "Jim McGreevy", explanation: `Jim McGreevy supports traffic efficiency improvements and better parking management to reduce frustration for drivers.` }
          ]
        },
        {
          text: "Add protected bike lanes and pedestrian walkways",
          candidates: ["James Solomon", "Mussab Ali"],
          explanations: [
            { candidate: "James Solomon", explanation: `James Solomon consistently supports protected bike lanes and expanding pedestrian infrastructure.` },
            { candidate: "Mussab Ali", explanation: `Mussab Ali backs pedestrian plazas and protected bike lane networks as part of a broader street redesign plan.` }
          ]
        },
        {
          text: "Promote transit-oriented development to reduce car reliance",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: `Mussab Ali supports building more housing near transit hubs and planning neighborhoods to reduce the need for driving, aligning with transit-oriented development principles.` }
          ]
        }
      ]
    },
    {
      id: 2,
      question: "Public Safety: What approach should the city take to keep neighborhoods safe?",
      options: [
        {
          text: "Increase police presence",
          candidates: ["Bill Odea", "Jim McGreevy"],
          explanations: [
            { candidate: "Bill Odea and Jim McGreevy", explanation: "Both Bill O'Dea and Jim McGreevey emphasize expanding the police force and restoring specialized units. McGreevey, in particular, has called for bringing back the police gang task force to address crime proactively." }
          ]
        },
        {
          text: "Invest in community programs",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali and James Solomon both support strengthening community infrastructure. Mussab focuses on funding after-school programs and community centers to reduce violence through prevention." },
            { candidate: "James Solomon", explanation: "Mussab Ali and James Solomon both support strengthening community infrastructure. Solomon supports expanding community-based alternatives to policing." }
          ]
        },
        {
          text: "Mix of both A and B",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Joyce Watterman has stated that safety requires both strong policing and strong community support. Her approach combines neighborhood investment with continued funding for law enforcement." }
          ]
        },
        {
          text: "Reallocate some police funding toward mental health services",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon has supported reallocating some public safety funding to create a non-police mental health response team, emphasizing that public safety includes mental health care." }
          ]
        },
        {
          text: "Invest in youth and neighborhood programs to prevent violence before it starts",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali centers his safety platform on youth-focused prevention — including violence interruption programs and support for youth development — to address the root causes of crime before they escalate." }
          ]
        }

      ]
    },
    {
      id: 3,
      question: "Emergency Calls: Who should respond to non-violent 911 calls involving mental health or substance abuse?",
      options: [
        {
          text: "Specially trained clinicians",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Both Mussab Ali and James Solomon support alternative crisis response models where trained professionals — not armed officers — handle non-violent emergencies. This includes clinicians equipped to de-escalate situations involving mental health." },
            { candidate: "James Solomon", explanation: "Both Mussab Ali and James Solomon support alternative crisis response models where trained professionals — not armed officers — handle non-violent emergencies. This includes clinicians equipped to de-escalate situations involving mental health." }
          ]
        },
        {
          text: "Police officer",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill O'Dea believes that police should continue to be the primary responders for all emergency calls, including mental health-related incidents." }
          ]
        },
        {
          text: "Coordinated team",
          candidates: ["Jim McGreevy", "Joyce Watterman"],
          explanations: [
            { candidate: "Jim McGreevy and Joyce Watterman", explanation: "McGreevey and Watterman favor team-based approaches that may include police and health professionals. McGreevey has talked about strengthening coordination between law enforcement and service providers." }
          ]
        },
        {
          text: "Community-based response centers",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon has proposed creating local, community-led emergency response hubs to dispatch trained professionals for mental health and substance abuse crises." }
          ]
        },
        {
          text: "Expand non-police emergency response units ",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali advocates for growing non-police emergency responder programs, with trained crisis teams that center de-escalation and care rather than enforcement." }
          ]
        }
      ]
    },
    {
      id: 4,
      question: "Housing Affordability: How can Jersey City best address rising housing costs?",
      options: [
        {
          text: "Requiring more affordable units in new developments",
          candidates: ["Mussab Ali", "James Solomon", "Joyce Watterman"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab supports stronger inclusionary zoning that ensures a meaningful percentage of units are reserved for working families." },
            { candidate: "James Solomon", explanation: " Solomon backs enforcement of existing mandates." },
            { candidate: "Joyce Watterman", explanation: " Watterman emphasizes increasing affordable housing through new construction." }
          ]
        },
        {
          text: "Strengthening rent controls",
          candidates: ["James Solomon", "Jim McGreevy"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon wants to expand rent control protections and close loopholes that allow landlords to hike rents." },
            { candidate: "Jim McGreevy", explanation: "McGreevey supports defending and strengthening rent control as part of a broader housing stability platform." }
          ]
        },
        {
          text: "Encouraging more overall housing construction",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill O'Dea believes increasing the total housing supply is essential. He supports policies that incentivize development across the city to meet growing demand and relieve market pressure." }
          ]
        },
        {
          text: "Provide rental subsidies and housing vouchers",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "Jim McGreevey emphasizes direct financial assistance to low-income renters, including increased use of housing vouchers and subsidies to prevent displacement." }
          ]
        },
        {
          text: "Ensure new development includes deeply affordable units and protects against displacement",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali supports ensuring affordability is not just token, but tied to actual area incomes. He also proposes legal support for tenants and anti-displacement strategies." }
          ]
        }
      ]
    },
    {
      id: 5,
      question: "Development and Gentrification: What is the best way for Jersey City to manage new development?",
      options: [
        {
          text: "Encourage growth to add housing",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill O'Dea emphasizes the importance of continued development to grow the city's housing stock and generate economic activity." }
          ]
        },
        {
          text: "Limit development to prevent gentrification",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "James Solomon has proposed zoning reforms to slow luxury development in historically working-class neighborhoods to reduce displacement and maintain affordability." }
          ]
        },
        {
          text: "Demand community benefits from developers",
          candidates: ["Mussab Ali", "Joyce Watterman"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Both Mussab Ali and Joyce Watterman call for negotiating strong community benefits agreements with developers. Mussab wants guarantees like affordable housing, local hiring, and community investment." },
            { candidate: "Joyce Watterman", explanation: "Both Mussab Ali and Joyce Watterman call for negotiating strong community benefits agreements with developers. Watterman stresses equitable development that includes amenities for existing residents." }
          ]
        },
        {
          text: "Tie development to affordability and sustainability",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali's platform calls for development that is both sustainable (e.g., transit-oriented, green buildings) and affordable, ensuring that growth doesn't come at the cost of working-class residents." }
          ]
        }
      ]
    },
    {
      id: 6,
      question: "Education Quality: What is the key to improving public schools in Jersey City?",
      options: [
        {
          text: "Increasing funding and resources (teachers, facilities)",
          candidates: ["Mussab Ali", "Joyce Watterman"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali emphasizes equitable funding, improving school infrastructure, and hiring more teachers to support student learning." },
            { candidate: "Joyce Watterman", explanation: "Watterman supports improving public school quality through investment and equity." }
          ]
        },
        {
          text: "Reforming school management",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea advocates for greater school oversight and critiques current management structures, which aligns with a call for reform." }
          ]
        },
        {
          text: "Expanding school choice options",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "Solomon has voiced interest in giving families more educational options, including supporting some charter initiatives, which often falls under 'school choice.'" }
          ]
        },
        {
          text: "Strengthen community-school partnerships",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali's platform highlights the importance of engaging families and local communities in school success through partnerships and localized support programs." }
          ]
        }
      ]
    },
    {
      id: 7,
      question: "Charter Schools: How should Jersey City approach charter schools?",
      options: [
        {
          text: "Expand them for more parent choice",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea advocates for expanding charter options as a form of school choice." }
          ]
        },
        {
          text: "Keep the focus on improving traditional public schools",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali strongly favors traditional public schools and prioritizes strengthening them rather than expanding charters." }
          ]
        },
        {
          text: "Find a balance between the two",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman supports both public and charter schools, with a goal of ensuring all students receive a quality education." }
          ]
        },
        {
          text: "Increase transparency and accountability for all schools",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "Solomon advocates for holding both public and charter schools accountable through transparency and community oversight." }
          ]
        }
      ]
    },
    {
      id: 8,
      question: "Immigration: How should Jersey City support its immigrant communities?",
      options: [
        {
          text: "Provide local services and protection for undocumented residents",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali's platform advocates for immigrant rights, including protections for undocumented residents and expanding access to city services regardless of immigration status." }
          ]
        },
        {
          text: "Make Jersey City a stronger sanctuary city by refusing to cooperate with ICE and expanding local protections",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab's platform includes expanding Jersey City's role as a sanctuary city, limiting cooperation with federal immigration enforcement, and enhancing legal protections for undocumented residents." }
          ]
        },
        {
          text: "Establish immigrant legal aid centers",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy supports legal resources and services for vulnerable residents, including immigrants." }
          ]
        },
        {
          text: "Promote cultural inclusion via community initiatives",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman's platform highlights unity and community building across all Jersey City neighborhoods, which includes culturally inclusive programming." }
          ]
        }
      ]
    },
    {
      id: 9,
      question: "Healthcare Access: What should the city do to improve healthcare for residents?",
      options: [
        {
          text: "Expand neighborhood clinics and mental health services",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali strongly supports expanding community-based clinics and increasing access to mental health services." },
            { candidate: "James Solomon", explanation: "Solomon also advocates for increased access to care, including mental health, particularly through city investments." }
          ]
        },
        {
          text: "Partner with hospitals for better access",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman supports partnerships with health institutions to improve service delivery across the city." }
          ]
        },
        {
          text: "Focus on public health outreach and prevention",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy prioritizes preventive healthcare and outreach, including addressing social determinants of health." }
          ]
        },
        {
          text: "Offer mobile services in underserved areas",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali's platform mentions bringing health services to communities directly, including mobile outreach in hard-to-reach areas." }
          ]
        }
      ]
    },
    {
      id: 10,
      question: "Climate Resilience: How should Jersey City address climate change and flooding risks?",
      options: [
        {
          text: "Invest in green infrastructure and emissions reduction",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali supports major investments in climate resilience, including stormwater infrastructure, emissions reduction, and sustainable building practices. He emphasizes creating a climate action plan focused on equity and long-term impact." }
          ]
        },
        {
          text: "Strengthen flood defenses",
          candidates: ["James Solomon", "Bill Odea"],
          explanations: [
            { candidate: "James Solomon and Bill Odea", explanation: "James Solomon has called for more serious investment in flood infrastructure, including better drainage and proactive storm protection. Bill Odea has emphasized updating sewer systems and addressing stormwater issues as critical to the city's resilience." }
          ]
        },
        {
          text: "Focus on other immediate issues first",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "There is no clear position from McGreevy on prioritizing climate resilience; his platform emphasizes other areas like affordability and public safety. This response reflects the absence of a stated climate-first focus." }
          ]
        },
        {
          text: "Use development regulations to encourage sustainability",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab's platform calls for tying development to climate goals—including stricter sustainability guidelines, green building incentives, and stormwater management requirements." }
          ]
        }
      ]
    },
    {
        id: 11,
      question: "Turnpike Expansion: How should the city respond to the state’s proposal to widen the NJ Turnpike extension near downtown?",
      options: [
        {
          text: "Support it to reduce traffic",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Bill Odea has stated that he supports widening the Turnpike extension as a way to reduce congestion. He has emphasized improving vehicle flow and infrastructure upgrades in the region." }
          ]
        },
        {
          text: "Oppose it over environmental concerns",
          candidates: ["Mussab Ali", "James Solomon"],
          explanations: [
            { candidate: "Mussab Ali and James Solomon", explanation: "Both Mussab Ali and James Solomon have publicly opposed the Turnpike expansion. Mussab frames it as an outdated, car-centric plan that undermines climate goals, while Solomon has criticized it for failing to align with Jersey City's sustainability commitments." }
          ]
        },
        {
          text: "Seek changes to the plan",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman has not explicitly opposed the project, but she has suggested the city should push for revisions or mitigations that reflect local concerns, including traffic and environmental impacts." }
          ]
        },
        {
          text: "Remain neutral until more data is available",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy has not taken a firm position on the Turnpike expansion; his materials do not express opposition or support, so a 'wait and assess' stance aligns with the data." }
          ]
        }
      ]
    },
    {
      id: 12,
      question: "Government Collaboration: What approach should Jersey City take in working with state and federal governments?",
      options: [
        {
          text: "Aggressively lobby for more funding",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab Ali has emphasized leveraging state and federal resources to bring investment into Jersey City, particularly in underserved neighborhoods." }
          ]
        },
        {
          text: "Build collaborative relationships",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy's experience in various levels of government suggests a preference for traditional intergovernmental collaboration." }
          ]
        },
        {
          text: "Rely mainly on local resources",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea has focused his platform on local government accountability and has expressed skepticism about relying too heavily on outside support." }
          ]
        },
        {
          text: "Use both state support and grassroots planning",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab supports combining top-down funding with bottom-up community input, including participatory budgeting and coalition-building with local organizers." }
          ]
        }
      ]
    },
    {
      id: 13,
      question: "Leadership Style: What type of leadership does Jersey City need in its next mayor?",
      options: [
        {
          text: "A seasoned insider with experience",
          candidates: ["Bill Odea"],
          explanations: [
            { candidate: "Bill Odea", explanation: "Odea emphasizes his decades of government experience and familiarity with city operations." }
          ]
        },
        {
          text: "A fresh outsider with new ideas",
          candidates: ["Jim McGreevy"],
          explanations: [
            { candidate: "Jim McGreevy", explanation: "McGreevy frames himself as a new face in the race, ready to challenge the status quo." }
          ]
        },
        {
          text: "A community-driven coalition-builder",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab positions himself as a grassroots leader focused on organizing community voices and building inclusive governance structures." }
          ]
        },
        {
          text: "A strict manager focused on efficiency",
          candidates: ["Joyce Watterman"],
          explanations: [
            { candidate: "Joyce Watterman", explanation: "Watterman has pitched herself as a no-nonsense manager ready to run the city efficiently." }
          ]
        }
      ]
    },
    {
      id: 14,
      question: "Transparency and Trust: How can City Hall be made more transparent and accountable?",
      options: [
        {
          text: "By enacting tougher ethics rules and limiting influence of developers/donors",
          candidates: ["James Solomon"],
          explanations: [
            { candidate: "James Solomon", explanation: "Solomon has made political reform and reducing developer influence key to his platform." }
          ]
        },
        {
          text: "By improving open data and communication",
          candidates: ["Mussab Ali"],
          explanations: [
            { candidate: "Mussab Ali", explanation: "Mussab supports increasing access to public information, including budget transparency, and simplifying communication between residents and City Hall." }
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
            { candidate: "Mussab Ali", explanation: "Mussab has called for campaign finance reform, including reducing the influence of PACs and developers, and supports term limits to bring fresh leadership." }
          ]
        }
      ]
    }
  ];