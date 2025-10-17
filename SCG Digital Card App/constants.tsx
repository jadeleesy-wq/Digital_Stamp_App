
import React from 'react';
import type { Booth } from './types';
import { Gamepad2, Lightbulb, Beaker, MicVocal, Code, Rocket, Film, Users, Trophy } from 'lucide-react';

export const ADMIN_PASSWORD = 'admin';
export const MIN_STAMPS_FOR_LUCKY_DRAW = 6;

export const DEFAULT_TEAMS = ['CMG', 'OE', 'Finance', 'Digital Governance', 'POD', 'Legal'];

export const BOOTHS: Booth[] = [
  { id: 1, name: 'Booth Alpha', secretCode: 'ALPHA24', icon: <Gamepad2 size={48} />, description: "Play our latest interactive game and see how we're changing the training landscape." },
  { id: 2, name: 'Booth Bravo', secretCode: 'BRAVO24', icon: <Lightbulb size={48} />, description: "Discover the bright ideas powering our next-gen products. It's illuminating!" },
  { id: 3, name: 'Booth Charlie', secretCode: 'CHARLIE24', icon: <Beaker size={48} />, description: "See our secret formula for success and experiment with our latest internal tools." },
  { id: 4, name: 'Booth Delta', secretCode: 'DELTA24', icon: <MicVocal size={48} />, description: "Hear from our team about the future of communication and our new podcast series." },
  { id: 5, name: 'Booth Echo', secretCode: 'ECHO24', icon: <Code size={48} />, description: "Get a sneak peek at the code behind our curtain. It's more than just magic!" },
  { id: 6, name: 'Booth Foxtrot', secretCode: 'FOXTROT24', icon: <Rocket size={48} />, description: "We're launching new initiatives! See our trajectory for the upcoming year." },
  { id: 7, name: 'Booth Golf', secretCode: 'GOLF24', icon: <Film size={48} />, description: "Watch our latest project highlight reel and see the cinematic stories we're telling." },
  { id: 8, name: 'Booth Hotel', secretCode: 'HOTEL24', icon: <Users size={48} />, description: "Learn how we're fostering collaboration and building stronger teams across the division." },
  { id: 9, name: 'Booth India', secretCode: 'INDIA24', icon: <Trophy size={48} />, description: "Celebrate our recent wins and see the award-winning work our team is delivering." },
];
