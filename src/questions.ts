
export interface Option {
    text: string;
    candidates: string[];
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
          candidates: ["Mussab Ali"]
        },
        {
          text: "Focus on stricter enforcement: reintroduce traffic enforcement units and advocate for speed cameras in school zones and high-risk areas.",
          candidates: ["James Solomon"]
        },
        {
          text: "Improve driver experience and accessibility by expanding parking, repaving roads, and synchronizing traffic lights.",
          candidates: ["Jim McGreevy", "Bill Odea"]
        },
        {
          text: "Ensure every neighborhood—especially underserved ones—gets safer streets, better sidewalks, and improved transit access.",
          candidates: ["Joyce Watterman"]
        }
      ]
    },
    {
      id: 1,
      question: "Transportation: What should be the top priority for improving transportation in Jersey City?",
      options: [
        {
          text: "Expanding public transit options",
          candidates: ["Mussab Ali", "James Solomon"]
        },
        {
          text: "Easing car traffic and parking",
          candidates: ["Bill Odea", "Jim McGreevy"]
        },
        {
          text: "Add protected bike lanes and pedestrian walkways",
          candidates: ["James Solomon", "Mussab Ali"]
        },
        {
          text: "Promote transit-oriented development to reduce car reliance",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
      id: 2,
      question: "Public Safety: What approach should the city take to keep neighborhoods safe?",
      options: [
        {
          text: "Increase police presence",
          candidates: ["Bill Odea", "Jim McGreevy"]
        },
        {
          text: "Invest in community programs",
          candidates: ["Mussab Ali", "James Solomon"]
        },
        {
          text: "Mix of both A and B",
          candidates: ["Joyce Watterman"]
        },
        {
          text: "Reallocate some police funding toward mental health services",
          candidates: ["James Solomon"]
        }
      ]
    },
    {
      id: 3,
      question: "Emergency Calls: Who should respond to non-violent 911 calls involving mental health or substance abuse?",
      options: [
        {
          text: "Specially trained clinicians",
          candidates: ["Mussab Ali", "James Solomon"]
        },
        {
          text: "Police officer",
          candidates: ["Bill Odea"]
        },
        {
          text: "Coordinated team",
          candidates: ["Jim McGreevy", "Joyce Watterman"]
        },
        {
          text: "Community-based response centers",
          candidates: ["James Solomon"]
        }
      ]
    },
    {
      id: 4,
      question: "Housing Affordability: How can Jersey City best address rising housing costs?",
      options: [
        {
          text: "Requiring more affordable units in new developments",
          candidates: ["Mussab Ali", "James Solomon", "Joyce Watterman"]
        },
        {
          text: "Strengthening rent controls",
          candidates: ["James Solomon", "Jim McGreevy"]
        },
        {
          text: "Encouraging more overall housing construction",
          candidates: ["Bill Odea"]
        },
        {
          text: "Provide rental subsidies and housing vouchers",
          candidates: ["Jim McGreevy"]
        }
      ]
    },
    {
      id: 5,
      question: "Development and Gentrification: What is the best way for Jersey City to manage new development?",
      options: [
        {
          text: "Encourage growth to add housing",
          candidates: ["Bill Odea"]
        },
        {
          text: "Limit development to prevent gentrification",
          candidates: ["James Solomon"]
        },
        {
          text: "Demand community benefits from developers",
          candidates: ["Mussab Ali", "Joyce Watterman"]
        },
        {
          text: "Tie development to affordability and sustainability",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
      id: 6,
      question: "Education Quality: What is the key to improving public schools in Jersey City?",
      options: [
        {
          text: "Increasing funding and resources (teachers, facilities)",
          candidates: ["Mussab Ali", "Joyce Watterman"]
        },
        {
          text: "Reforming school management",
          candidates: ["Bill Odea"]
        },
        {
          text: "Expanding school choice options",
          candidates: ["James Solomon"]
        },
        {
          text: "Strengthen community-school partnerships",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
      id: 7,
      question: "Charter Schools: How should Jersey City approach charter schools?",
      options: [
        {
          text: "Expand them for more parent choice",
          candidates: ["Bill Odea"]
        },
        {
          text: "Keep the focus on improving traditional public schools",
          candidates: ["Mussab Ali"]
        },
        {
          text: "Find a balance between the two",
          candidates: ["Joyce Watterman"]
        },
        {
          text: "Increase transparency and accountability for all schools",
          candidates: ["James Solomon"]
        }
      ]
    },
    {
      id: 8,
      question: "Immigration: How should Jersey City support its immigrant communities?",
      options: [
        {
          text: "Provide local services and protection for undocumented residents",
          candidates: ["Mussab Ali"]
        },
        {
          text: "Cooperate closely with federal immigration authorities",
          candidates: ["Bill Odea"]
        },
        {
          text: "Establish immigrant legal aid centers",
          candidates: ["Jim McGreevy"]
        },
        {
          text: "Promote cultural inclusion via community initiatives",
          candidates: ["Joyce Watterman"]
        }
      ]
    },
    {
      id: 9,
      question: "Healthcare Access: What should the city do to improve healthcare for residents?",
      options: [
        {
          text: "Expand neighborhood clinics and mental health services",
          candidates: ["Mussab Ali", "James Solomon"]
        },
        {
          text: "Partner with hospitals for better access",
          candidates: ["Joyce Watterman"]
        },
        {
          text: "Focus on public health outreach and prevention",
          candidates: ["Jim McGreevy"]
        },
        {
          text: "Offer mobile services in underserved areas",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
      id: 10,
      question: "Climate Resilience: How should Jersey City address climate change and flooding risks?",
      options: [
        {
          text: "Invest in green infrastructure and emissions reduction",
          candidates: ["Mussab Ali"]
        },
        {
          text: "Strengthen flood defenses",
          candidates: ["James Solomon", "Bill Odea"]
        },
        {
          text: "Focus on other immediate issues first",
          candidates: ["Jim McGreevy"]
        },
        {
          text: "Use development regulations to encourage sustainability",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
        id: 11,
      question: "Turnpike Expansion: How should the city respond to the state’s proposal to widen the NJ Turnpike extension near downtown?",
      options: [
        {
          text: "Support it to reduce traffic",
          candidates: ["Bill Odea"]
        },
        {
          text: "Oppose it over environmental concerns",
          candidates: ["Mussab Ali", "James Solomon"]
        },
        {
          text: "Seek changes to the plan",
          candidates: ["Joyce Watterman"]
        },
        {
          text: "Remain neutral until more data is available",
          candidates: ["Jim McGreevy"]
        }
      ]
    },
    {
      id: 12,
      question: "Government Collaboration: What approach should Jersey City take in working with state and federal governments?",
      options: [
        {
          text: "Aggressively lobby for more funding",
          candidates: ["Mussab Ali"]
        },
        {
          text: "Build collaborative relationships",
          candidates: ["Jim McGreevy"]
        },
        {
          text: "Rely mainly on local resources",
          candidates: ["Bill Odea"]
        },
        {
          text: "Use both state support and grassroots planning",
          candidates: ["Mussab Ali"]
        }
      ]
    },
    {
      id: 13,
      question: "Leadership Style: What type of leadership does Jersey City need in its next mayor?",
      options: [
        {
          text: "A seasoned insider with experience",
          candidates: ["Bill Odea"]
        },
        {
          text: "A fresh outsider with new ideas",
          candidates: ["Jim McGreevy"]
        },
        {
          text: "A community-driven coalition-builder",
          candidates: ["Mussab Ali"]
        },
        {
          text: "A strict manager focused on efficiency",
          candidates: ["Joyce Watterman"]
        }
      ]
    },
    {
      id: 14,
      question: "Transparency and Trust: How can City Hall be made more transparent and accountable?",
      options: [
        {
          text: "By enacting tougher ethics rules and limiting influence of developers/donors",
          candidates: ["James Solomon"]
        },
        {
          text: "By improving open data and communication",
          candidates: ["Mussab Ali"]
        },
        {
          text: "By maintaining the current oversight with no major changes",
          candidates: []
        },
        {
          text: "Impose term limits and clean campaign rules",
          candidates: ["Mussab Ali"]
        }
      ]
    }
  ];